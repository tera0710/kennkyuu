import { useState, useRef, useEffect } from "react";

function EndScreen({ results, onSend }) {

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    // 12問の主観的な迷い度アンケート
    const [showSurvey, setShowSurvey] = useState(false);
    const [subjectiveHesitation, setSubjectiveHesitation] = useState([]);
    const [surveyQuestion, setSurveyQuestion] = useState(0);

    // 全体アンケート
    const [showOverallSurvey, setShowOverallSurvey] = useState(false);
    const [overallSurvey, setOverallSurvey] = useState({});
    const [overallQuestion, setOverallQuestion] = useState(0);

    // 自由記述
    const [showFreeComment, setShowFreeComment] = useState(false);
    const [freeComment, setFreeComment] = useState("");


    // =========================
    // データ送信
    // =========================


    async function handleSend() {

        setSending(true);

        try {

            await onSend({
                subjectiveHesitation: subjectiveHesitation,
                overallSurvey: overallSurvey,
                freeComment: freeComment
            });

            setSent(true);

        } catch (error) {

            console.error("送信エラー:", error);

            alert("送信に失敗しました。もう一度お試しください。");

        } finally {

            setSending(false);

        }
    }




    // =========================
    // 平均HI
    // =========================

    const averageHI =
        results.length > 0
            ? results.reduce(
                (total, result) => total + result.HI,
                0
            ) / results.length
            : 0;


    let overallHesitationLevel;

    if (averageHI < 1.5) {

        overallHesitationLevel = "低";

    } else if (averageHI < 2.5) {

        overallHesitationLevel = "中";

    } else {

        overallHesitationLevel = "高";

    }


    // =========================
    // 送信完了画面
    // =========================

    if (sent) {

        return (

            <div className="end_screen">

                <h2>
                    ご協力ありがとうございました
                </h2>

                <p>
                    回答データの送信が完了しました。
                </p>

            </div>

        );

    }


    // =========================
    // 12問の主観的迷い度
    // =========================

    if (showSurvey) {

        const result = results[surveyQuestion];


        function handleHesitationAnswer(value) {

            const newHesitation = [
                ...subjectiveHesitation
            ];

            newHesitation[surveyQuestion] = value;

            setSubjectiveHesitation(
                newHesitation
            );


            // Q12より前なら次の質問へ
            if (
                surveyQuestion <
                results.length - 1
            ) {

                setTimeout(() => {
                    setSurveyQuestion(prev => prev + 1);
                }, 300);

            } else {

                // Q12終了
                console.log(
                    "迷い度アンケート回答:",
                    newHesitation
                );

                setShowSurvey(false);

                setOverallQuestion(0);

                setShowOverallSurvey(true);

            }

        }


        return (

            <div className="end_screen">

                <h2>
                    実験後アンケート
                </h2>


                <p>
                    Q{surveyQuestion + 1} / {results.length}
                </p>

                <p className="question_name">
                    この質問に回答するとき、
                    どの程度迷いましたか？
                </p>

                <p className="question_text">
                    {result.question}
                </p>

                <div className="choices">


                    <div className="choice_item">

                        <p>
                            全く迷わなかった
                        </p>

                        <input
                            type="radio"
                            name={`hesitation${surveyQuestion}`}
                            value="1"
                            checked={
                                subjectiveHesitation[
                                surveyQuestion
                                ] === "1"
                            }
                            onChange={(e) =>
                                handleHesitationAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            あまり迷わなかった
                        </p>

                        <input
                            type="radio"
                            name={`hesitation${surveyQuestion}`}
                            value="2"
                            checked={
                                subjectiveHesitation[
                                surveyQuestion
                                ] === "2"
                            }
                            onChange={(e) =>
                                handleHesitationAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            どちらともいえない
                        </p>

                        <input
                            type="radio"
                            name={`hesitation${surveyQuestion}`}
                            value="3"
                            checked={
                                subjectiveHesitation[
                                surveyQuestion
                                ] === "3"
                            }
                            onChange={(e) =>
                                handleHesitationAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            少し迷った
                        </p>

                        <input
                            type="radio"
                            name={`hesitation${surveyQuestion}`}
                            value="4"
                            checked={
                                subjectiveHesitation[
                                surveyQuestion
                                ] === "4"
                            }
                            onChange={(e) =>
                                handleHesitationAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            とても迷った
                        </p>

                        <input
                            type="radio"
                            name={`hesitation${surveyQuestion}`}
                            value="5"
                            checked={
                                subjectiveHesitation[
                                surveyQuestion
                                ] === "5"
                            }
                            onChange={(e) =>
                                handleHesitationAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>

        );

    }


    // =========================
    // 全体アンケート
    // =========================

    if (showOverallSurvey) {

        const overallQuestions = [

            "ヒントや画面の変化は、回答する際の助けになりましたか？",

            "自分の迷いに応じて画面が変化することは、回答しやすさにつながったと感じましたか？",

            "画面の変化やヒントの表示は自然に感じましたか？",

            "今回のアンケートは回答しやすいと感じましたか？",

            "一般的なWebアンケートと比較して、今回のアンケートは回答しやすかったですか？"

        ];


        function handleOverallAnswer(value) {

            const key =
                `overall${overallQuestion + 1}`;


            const newSurvey = {

                ...overallSurvey,

                [key]: value

            };


            setOverallSurvey(
                newSurvey
            );


            // Q1～Q4
            if (overallQuestion < 4) {

                setTimeout(() => {
                    setOverallQuestion(prev => prev + 1);
                }, 300);

            } else {

                // Q5終了
                console.log(
                    "全体アンケート回答:",
                    newSurvey
                );

                setShowOverallSurvey(false);

                setShowFreeComment(true);

            }

        }


        return (

            <div className="end_screen">

                <h2>
                    アンケート全体について
                </h2>


                <p>
                    Q{overallQuestion + 1} / {overallQuestions.length}
                </p>


                <p className="question_name">
                    {overallQuestions[overallQuestion]}
                </p>


                <div className="choices">


                    <div className="choice_item">

                        <p>
                            全くそう思わない
                        </p>

                        <input
                            type="radio"
                            name={`overall${overallQuestion}`}
                            value="1"
                            checked={
                                overallSurvey[
                                `overall${overallQuestion + 1}`
                                ] === "1"
                            }
                            onChange={(e) =>
                                handleOverallAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            あまりそう思わない
                        </p>

                        <input
                            type="radio"
                            name={`overall${overallQuestion}`}
                            value="2"
                            checked={
                                overallSurvey[
                                `overall${overallQuestion + 1}`
                                ] === "2"
                            }
                            onChange={(e) =>
                                handleOverallAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            どちらでもない
                        </p>

                        <input
                            type="radio"
                            name={`overall${overallQuestion}`}
                            value="3"
                            checked={
                                overallSurvey[
                                `overall${overallQuestion + 1}`
                                ] === "3"
                            }
                            onChange={(e) =>
                                handleOverallAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            ややそう思う
                        </p>

                        <input
                            type="radio"
                            name={`overall${overallQuestion}`}
                            value="4"
                            checked={
                                overallSurvey[
                                `overall${overallQuestion + 1}`
                                ] === "4"
                            }
                            onChange={(e) =>
                                handleOverallAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="choice_item">

                        <p>
                            とてもそう思う
                        </p>

                        <input
                            type="radio"
                            name={`overall${overallQuestion}`}
                            value="5"
                            checked={
                                overallSurvey[
                                `overall${overallQuestion + 1}`
                                ] === "5"
                            }
                            onChange={(e) =>
                                handleOverallAnswer(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>

        );

    }


    // =========================
    // 自由記述
    // =========================

    if (showFreeComment) {

        return (

            <div className="end_screen">

                <h2>
                    最後に
                </h2>


                <p>
                    今回のアンケートについて、
                    気になった点や改善してほしい点があれば
                    自由に記入してください。
                </p>


                <textarea
                    value={freeComment}
                    onChange={(e) =>
                        setFreeComment(e.target.value)
                    }
                    placeholder="自由に入力してください"
                    rows="6"
                />


                <button className="send_button"
                    onClick={handleSend}
                    disabled={sending}
                >

                    {sending
                        ? "送信中..."
                        : "回答を送信"
                    }

                </button>

            </div>

        );

    }


    // =========================
    // 結果画面
    // =========================

    return (

        <div className="end_screen">

            <h2>
                アンケート結果
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>質問</th>
                        <th>回答</th>
                        <th className="HI">HI（迷い度）</th>

                    </tr>

                </thead>


                <tbody>

                    {results.map(
                        (result, index) => (

                            <tr key={index}>

                                <td>
                                    {result.question}
                                </td>

                                <td>
                                    {result.answer}
                                </td>

                                <td>
                                    {
                                        result.HI < 1.5
                                            ? "低"
                                            : result.HI < 2.5
                                                ? "中"
                                                : "高"
                                    }
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>


            <div className="overall_result">

                <p>
                    総合迷い度：
                    <span>{overallHesitationLevel}</span>
                </p>

            </div>


            <button
                onClick={() => {

                    setSurveyQuestion(0);

                    setShowSurvey(true);

                }}
            >
                実験後アンケートへ
            </button>

        </div>

    );

}

export default EndScreen;