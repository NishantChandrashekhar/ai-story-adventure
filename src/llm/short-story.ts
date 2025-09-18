import { StoryType } from "./story-type";
export class ShortStory extends StoryType{
    protected numberOfChoicesSoFar: number = 0;
    numberOfSentencesPerResponse: number = 7;
    constructor(){
        super();
    }
    getLLMRole(theme: string): string {
        const role = this.themeIntro() + `
        The theme of the story is as follows: \n
        ${theme} \n

        Format your response exactly like this:
        RESPONSE: [Your narrative here]
        CHOICES:
        1. [First choice]
        2. [Second choice]
        3. [Third choice]
        4. [Fourth choice]`
        return role;
    }
    getUserPrompt(userChoice: string): string {
        this.numberOfChoicesSoFar++;
        let response = ``;
        switch(this.numberOfChoicesSoFar){
            case 1:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Introduce atmost 3 characters by naming them and possibly explore the environment in which the theme is set.
                `
                break;
            case 2:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Develop the characters that have been introduced in the response of MESSAGE NUMBER 1.
                `
                break;
            case 3:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Introduce a subtle detail that will be used later on in the story for foreshadowing. Note that you don't have to explicitly mention the foreshadow.
                `
                break;
            case 4:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Set a premise for a climax that would be revealed later on in the story. Don't explicitly mention that it is a climax.
                `
                break;
            case 5:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Create a thought provoking dilemma for the characters in the story.
                `
                break;
            case 6:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Direct the story to an action packed scene.
                `
                break;
            case 7:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Conclude the action scene created in the response of MESSAGE NUMBER 6 by reaching the climax that was set in the response of MESSAGE NUMBER 5.
                `
                break;
            case 8:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Reveal the climax by connecting it with the foreshadowing hint that was dropped in response to MESSAGE NUMBER 3.
                `
                break;
            case 9:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Conclude the fate of the characters appropriately.
                `
                break;
            case 10:
                response = 
                `
                    MESSAGE NUMBER: ${this.numberOfChoicesSoFar.toString()}
                    THE CHOICE: ${userChoice}
                    ACTION: Conclude the story with a thought provoking moral. The choices in the response should only say Thank you in all four choices.
                `
                break;
        }
        return response;
    }
    reset(): void {
        this.numberOfChoicesSoFar = 0;
    }
}