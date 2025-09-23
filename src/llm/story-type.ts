/**
 * Strategy base for shaping LLM prompts and turn-by-turn story guidance.
 *
 * Patterns:
 * - Strategy: concrete types implement role and user prompt generation
 * - Template Method: `themeIntro()` is a reusable prompt hook
 *
 * Extension points:
 * - getLLMRole(theme): system role instructions, must enforce RESPONSE/CHOICES format
 * - getUserPrompt(choice): staged turn instructions
 * - reset(): clear any internal counters/state
 */
export abstract class StoryType{
    protected abstract numberOfChoicesSoFar: number;
    protected abstract numberOfSentencesPerResponse: number;
    abstract getLLMRole(theme: string): string;
    abstract getUserPrompt(userChoice: string): string;
    abstract reset(): void;
    protected themeIntro(): string {
        return `You are a creative storyteller creating interactive adventures. Generate engaging, immersive responses that continue the story based on the user's choices. Keep responses elaborate (without crossing ${this.numberOfSentencesPerResponse} sentences) and always provide 4 new choices for the player. Do NOT use complex vocabulary.`
    }
}