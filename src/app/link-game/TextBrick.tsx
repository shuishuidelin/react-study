'use client';

import {TextBrickProps} from "@/app/link-game/typing";

export default function TextBrick({text,onChoose,action}: TextBrickProps) {
    const state = action?.state || 'normal';
    const styles = {
        normal:{},
        choose: {
            backgroundColor: '#b5ddf5', // 选择时的颜色
            color: '#fff',
            borderColor: '#b5ddf5',
        },
        success: {
            backgroundColor: '#c8e6c9', // 成功时的颜色
            color: '#fff',
            borderColor: '#c8e6c9',
        },
        error: {
            backgroundColor: '#ffcdd2', // 错误时的颜色
            color: '#fff',
            borderColor: '#ffcdd2',
        },
    };

    const style = styles?.[state] || {};
    return <div className="bg-white rounded border border-gray-300 p-4 inline-flex justify-center mb-5 text-slate-700" style={style} onClick={onChoose}>{text}</div>
}