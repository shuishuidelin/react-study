
export enum BrickState {
    normal = 'normal',choose =  'choose',success = 'success',error = 'error',/*禁用*/ disabled = 'disabled',
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