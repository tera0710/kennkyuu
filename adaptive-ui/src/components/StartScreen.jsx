import { useState } from "react";

function StartScreen({ onStart }) {

    const [participantId, setParticipantId] = useState("");

    return (
        <div className="start_screen">

            <h1>適応型アンケートUI</h1>

            <p>学生番号 又は 氏名を入力してください</p>

            <input
                type="text"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                placeholder="例：26A5233"
            />

            <button
                className="start_button"
                onClick={() => onStart(participantId)}
                disabled={!participantId}
            >
                開始
            </button>

        </div>
    );
}

export default StartScreen;