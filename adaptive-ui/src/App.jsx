import { AnimatePresence } from "framer-motion";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import { useState, useEffect } from "react";
import StartScreen from "./components/StartScreen";
import EndScreen from "./components/EndScreen";
import ProgressBar from "./components/ProgressBar";

function App() {



  async function sendResults(surveyData) {

    const data = {
      participantId: participantId,
      results: results,

      // 実験後アンケートの回答
      subjectiveHesitation: surveyData.subjectiveHesitation,
      overallSurvey: surveyData.overallSurvey,
      freeComment: surveyData.freeComment
    };

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyOVX_GFG0v-1dSg2uuHLEpbc2X_fSy8YIhImUKWxgDFZo8EInqPgCcPenkPWjROG4X/exec",
      {
        method: "POST",
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error("データの送信に失敗しました");
    }

    console.log("全結果の送信完了");
  }









  const [screen, setScreen] = useState("start");

  const [selected, setSelected] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [transitionDuration, setTransitionDuration] = useState(0.4);

  const [startTime, setStartTime] = useState(Date.now());
  const [answerTime, setAnswerTime] = useState(null);

  const [results, setResults] = useState([]);
  const [participantId, setParticipantId] = useState("");

  const questions = [
    {
      text: "新しいことに挑戦する機会があれば、自分から積極的に取り組みますか。",
      hint: "これまでに新しいことに挑戦した経験を思い出してみましょう。"
    },
    {
      text: "日々の時間を計画的に使うことができていますか。",
      hint: "普段の一日の過ごし方を振り返ってみましょう。"
    },
    {
      text: "複数の意見が対立した場合、それぞれの意見の内容を比較しながら、自分なりの判断を下すことができますか。",
      hint: "これまでに、自分とは異なる意見を聞いたときのことを思い出してみましょう。"
    },
    {
      text: "複数の作業や計画を同時に進める際、それぞれの内容に矛盾が生じないよう、全体のバランスを考慮して行動できますか。",
      hint: "複数の物事を同時に進める場面で、何を優先するか考えてみましょう。"
    },
    {
      text: "周囲から期待されている役割と、自分が希望する役割が異なる場合、それぞれの立場や状況を考慮して判断できますか。",
      hint: "周囲の期待と自分の希望のどちらを重視するか考えてみましょう。"
    },
    {
      text: "将来の目標が明確に定まっていない場合でも、複数の可能性を考慮しながら、今後の進む方向を判断できますか。",
      hint: "進路や将来について迷ったとき、自分なりに方向性を決められた経験を振り返ってみましょう。"
    },
    {
      text: "自分にとって必ずしも得意ではないことでも、将来的に役立つと考えた場合、時間や労力をかけて継続的に取り組むことができますか。",
      hint: "自分にとって負担のあることに、どの程度継続して取り組めるか考えてみましょう。"
    },
    {
      text: "複数の選択肢にそれぞれ異なる利点と欠点があり、どれを選んでも一定の不利益が生じる場合、自分なりの判断基準を持って選択できますか。",
      hint: "選択する際に、自分が何を最も重視するか考えてみましょう。"
    },
    // {
    //   text: "情報が完全にそろうまで待つことと、現時点で得られている情報をもとに判断することを考えてみましょう。",
    //   hint: "相手に合わせることだけでなく、自分の考えを持ったまま相手の意見を受け入れられるか考えてください。"
    // },
    // {
    //   text: "何かを選択するとき、後から後悔しないと思える判断ができている。",
    //   hint: "結果が良かったかではなく、選択した時点で自分が納得できていたかを基準に考えてください。"
    // },
    // {
    //   text: "自分にとって良い選択とは何かを、その場の状況に応じて判断できている。",
    //   hint: "結果だけで判断せず、そのときの目的や状況、自分が大切にしていたことを含めて考えてください。"
    // },
  ];

  const choices = [
    "全くそう思わない",
    "あまりそう思わない",
    "どちらでもない",
    "ややそう思う",
    "とてもそう思う"
  ];

  useEffect(() => {
    setStartTime(Date.now());
    setAnswerTime(null);
  }, [currentQuestion]);



  function handleAnswer(choice, hoverData) {

    console.log("回答された！");
    console.log("受け取ったデータ:", hoverData);

    const elapsed = Date.now() - startTime;

    const HI = hoverData.HI;


    let nextTransitionDuration;

    if (HI < 1.5) {
      nextTransitionDuration = 0.4;
    } else if (HI < 2.5) {
      nextTransitionDuration = 0.6;
    } else {
      nextTransitionDuration = 0.8;
    }

    setTransitionDuration(nextTransitionDuration);

    console.log("回答時間:", elapsed);
    console.log("ホバー時間:", hoverData.hoverTimes);
    console.log("ホバー選択肢数:", hoverData.hoveredChoiceCount);
    console.log("最終HI:", HI);

    setSelected(choice);
    setAnswerTime(elapsed);

    const newResult = {
      question: questions[currentQuestion].text,
      answer: choice,
      answerTime: elapsed,
      hoverTimes: hoverData.hoverTimes,
      hoveredChoiceCount: hoverData.hoveredChoiceCount,
      HI: HI
    };

    setResults(prev => [
      ...prev,
      newResult
    ]);


    setTimeout(() => {

      console.log("次の質問へ");

      if (currentQuestion < questions.length - 1) {

        setCurrentQuestion(prev => prev + 1);

      } else {

        setScreen("end");

      }

    }, 500);

  }

  return (

    <div className="app">

      <div className="background_blob blob1"></div>
      <div className="background_blob blob2"></div>
      <div className="background_grid"></div>

      {screen === "start" &&
        <StartScreen
          onStart={(id) => {
            setParticipantId(id);
            setStartTime(Date.now());
            setCurrentQuestion(0);
            setSelected(null);
            setResults([]);
            setScreen("question");
          }}
        />
      }

      {screen === "question" && (

        <>

          {/* <ProgressBar current={currentQuestion + 1} total={questions.length} /> */}

          <AnimatePresence mode="wait">

            <QuestionCard
              key={currentQuestion}
              question={questions[currentQuestion].text}
              hint={questions[currentQuestion].hint}
              choices={choices}
              selected={selected}
              onAnswer={handleAnswer}
              answerTime={answerTime}
              transitionDuration={transitionDuration}
              startTime={startTime}
            />

          </AnimatePresence>

        </>

      )}

      {screen === "end" && (

        <EndScreen
          results={results}
          onSend={sendResults}
        />

      )}

    </div>

  );
}

export default App;