
export enum BrickState {
    normal = 'normal',choose =  'choose',success = 'success',error = 'error'
}

export interface WordInfo {
    id: string;
    question: string;
    answer: string;
    state?: BrickState
}
export interface TextBrickProps {
    text: string
    onChoose: () => void;
    action?: {
        state?: BrickState
    }
}