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