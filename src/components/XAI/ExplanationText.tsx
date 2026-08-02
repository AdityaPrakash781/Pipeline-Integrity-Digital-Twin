import type { XAIOutput } from '../../types';

interface ExplanationTextProps {
    xaiData: XAIOutput;
}

/**
 * Natural language explanation generator for XAI outputs
 */
export default function ExplanationText({ xaiData }: ExplanationTextProps) {
    // Sort contributors by percentage
    const sorted = [...xaiData.contributors].sort((a, b) => b.contribution_pct - a.contribution_pct);

    // Generate natural language explanation
    const generateExplanation = () => {
        const top = sorted[0];
        const second = sorted[1];

        let explanation = `This degradation forecast is primarily driven by `;

        // Describe top contributor
        if (top.contribution_pct > 40) {
            explanation += `**${top.feature.toLowerCase()}** (${top.contribution_pct.toFixed(0)}% contribution)`;
        } else {
            explanation += `${top.feature.toLowerCase()} (${top.contribution_pct.toFixed(0)}% contribution)`;
        }

        // Add second contributor if significant
        if (second && second.contribution_pct > 20) {
            explanation += ` and **${second.feature.toLowerCase()}** (${second.contribution_pct.toFixed(0)}% contribution)`;
        }

        explanation += `. `;

        // Add confidence statement
        const confidencePct = (xaiData.model_confidence * 100).toFixed(0);
        if (xaiData.model_confidence > 0.8) {
            explanation += `The model has high confidence (${confidencePct}%) in this prediction.`;
        } else if (xaiData.model_confidence > 0.6) {
            explanation += `The model has moderate confidence (${confidencePct}%) in this prediction.`;
        } else {
            explanation += `The model has lower confidence (${confidencePct}%) in this prediction, suggesting additional monitoring may be warranted.`;
        }

        return explanation;
    };

    const explanation = generateExplanation();

    // Parse markdown-style bold text
    const renderExplanation = () => {
        const parts = explanation.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="text-emerald-400 font-semibold">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="text-sm text-zinc-300 leading-relaxed">
            {renderExplanation()}
        </div>
    );
}
