import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { generateSegments, updateRandomSegment } from './mockData.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize segment data
let segments = generateSegments();

/**
 * REST API Endpoints
 */

// Get all segments
app.get('/api/segments', (req, res) => {
    res.json(segments);
});

// Get specific segment
app.get('/api/segments/:id', (req, res) => {
    const segment = segments.find(s => s.segment_id === req.params.id);
    if (segment) {
        res.json(segment);
    } else {
        res.status(404).json({ error: 'Segment not found' });
    }
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Pipeline Digital Twin Backend`);
    console.log(`   HTTP Server: http://localhost:${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}`);
    console.log(`\n📊 Mock Data Initialized:`);
    console.log(`   - ${segments.length} pipeline segments`);
    console.log(`   - CV, PINN, and XAI data generated`);
    console.log(`\n🔄 Real-time updates every 3 seconds\n`);
});

/**
 * WebSocket Server
 */
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('✅ WebSocket client connected');

    // Send initial data
    ws.send(JSON.stringify({
        type: 'initial_data',
        data: segments,
        timestamp: new Date().toISOString()
    }));

    ws.on('close', () => {
        console.log('❌ WebSocket client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

/**
 * Simulate real-time updates
 * Every 3 seconds, update a random segment and broadcast to all clients
 */
setInterval(() => {
    const updatedSegment = updateRandomSegment(segments);

    const message = {
        type: 'segment_update',
        data: updatedSegment,
        timestamp: new Date().toISOString()
    };

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify(message));
        }
    });

    console.log(`📡 Updated ${updatedSegment.segment_id} - Integrity: ${(updatedSegment.integrity * 100).toFixed(1)}%`);
}, 3000);

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    wss.clients.forEach((client) => client.close());
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
