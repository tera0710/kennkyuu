import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function QuestionCard(props) {

    const [hoverTimes, setHoverTimes] = useState({});
    const [hoverStartTimes, setHoverStartTimes] = useState({});

    const [hoveredChoices, setHoveredChoices] = useState([]);

    const [liveHI, setLiveHI] = useState(0);

    const [hesitationLevel, setHesitationLevel] = useState("low");
    const [showManualHint, setShowManualHint] = useState(false);

    const [currentHoverChoice, setCurrentHoverChoice] = useState(null);

    useEffect(() => {

        const timer = setInterval(() => {

            // 現在までの回答時間
            const elapsed = Date.now() - props.startTime;

            // すでに確定しているホバー時間
            let totalHoverTime = Object.values(hoverTimes).reduce(
                (total, time) => total + time,
                0
            );

            // 現在ホバー中の選択肢だけ時間を追加
            if (currentHoverChoice !== null) {

                const start = hoverStartTimes[currentHoverChoice];

                if (start) {
                    totalHoverTime += Date.now() - start;
                }

            }

            // 正規化
            const Tn = Math.min(elapsed / 10000, 1);

            const Ht = Math.min(totalHoverTime / 10000, 1);

            const Hc =
                hoveredChoices.length / props.choices.length;

            // HI計算
            const HI =
                Tn + Ht + Hc + (Ht * Hc);

            setLiveHI(HI);

            // HIによって迷い度を3段階に分類
            if (HI < 1.5) {
                setHesitationLevel("low");
            } else if (HI < 2.5) {
                setHesitationLevel("medium");
            } else {
                setHesitationLevel("high");
            }

        }, 100);

        return () => clearInterval(timer);

    }, [
        props.startTime,
        hoverTimes,
        hoverStartTimes,
        currentHoverChoice,
        hoveredChoices,
        props.choices.length
    ]);


    useEffect(() => {
        setShowManualHint(false);
    }, [props.question]);


    return (

        <motion.div className="question_card"

            initial={{
                opacity: 0,
                y: 30
            }}

            animate={{
                opacity: 1,
                y: 0
            }}

            exit={{
                opacity: 0,
                y: -30
            }}

            transition={{
                duration: props.transitionDuration
            }}
        >


            <h2 className="question_title">
                {props.question}
            </h2>

            <div className="choices">
                {props.choices.map((choice) => (
                    <div
                        className="choice_item"
                        key={choice}
                    >
                        <p>{choice}</p>

                        <input
                            type="radio"
                            name="answer"
                            onMouseEnter={() => {

                                setHoverStartTimes(prev => ({
                                    ...prev,
                                    [choice]: Date.now()
                                }));

                                setHoveredChoices(prev => {

                                    if (prev.includes(choice)) {
                                        return prev;
                                    }

                                    return [...prev, choice];

                                });

                                setCurrentHoverChoice(choice);

                            }}

                            onMouseLeave={() => {

                                const start = hoverStartTimes[choice];

                                if (start) {

                                    const hoverTime = Date.now() - start;

                                    setHoverTimes(prev => ({
                                        ...prev,
                                        [choice]: (prev[choice] || 0) + hoverTime
                                    }));

                                }

                                setCurrentHoverChoice(null);

                                setHoverStartTimes(prev => {
                                    const newTimes = { ...prev };
                                    delete newTimes[choice];
                                    return newTimes;
                                });

                            }}

                            onChange={() => {

                                const currentHoverTime =
                                    hoverStartTimes[choice]
                                        ? Date.now() - hoverStartTimes[choice]
                                        : 0;

                                const finalHoverTimes = {
                                    ...hoverTimes,
                                    [choice]:
                                        (hoverTimes[choice] || 0) + currentHoverTime
                                };

                                const finalHoveredChoices =
                                    hoveredChoices.includes(choice)
                                        ? hoveredChoices
                                        : [...hoveredChoices, choice];

                                props.onAnswer(choice, {
                                    hoverTimes: finalHoverTimes,
                                    hoveredChoiceCount: finalHoveredChoices.length,
                                    HI: liveHI
                                });

                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="hint_area">

                {hesitationLevel === "medium" && !showManualHint && (
                    <button
                        className="hint_button"
                        onClick={() => setShowManualHint(true)}
                    >
                        💡 ヒントを見る
                    </button>
                )}

                {(hesitationLevel === "high" || showManualHint) && (
                    <div className="hint">
                        {props.hint}
                    </div>
                )}

            </div>


            {/* 回答中に表示させたければ */}
            {/* <p>リアルタイムHI：{liveHI.toFixed(2)}</p>

            <pre>
                {JSON.stringify(hoverTimes, null, 2)}
            </pre>

            <p>
                ホバーした選択肢数：{hoveredChoices.length}
            </p> */}

        </motion.div>

    );
}

export default QuestionCard;