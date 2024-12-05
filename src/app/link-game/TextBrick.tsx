'use client';

export default function TextBrick({text}: {text: string}) {
    return <div className="bg-white rounded border border-gray-700 p-2.5 pl-4 pr-4 inline-flex">{text}</div>
}