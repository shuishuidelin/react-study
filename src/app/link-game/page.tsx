// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
import TextBrick from "@/app/link-game/TextBrick";

export default function LinkGame() {
    return (<div>
        <h1>Hello, Dashboard Page!</h1>
        <TextBrick text={'你好'}></TextBrick>
    </div>)
}