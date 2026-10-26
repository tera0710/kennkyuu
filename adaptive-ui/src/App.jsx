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
      text: "あなたは、新しいことに挑戦する機会があれば、自分から積極的に取り組みますか？",
      hint: "新しい趣味や活動、これまで経験したことのない作業などを想像し、自分がどのように行動することが多いかを考えてみましょう。"
    },
    {
      text: "あなたは、日々の時間を計画的に使うことができていますか？",
      hint: "勉強や仕事、趣味、休息などに使う時間を振り返り、予定を立てて行動することが多いかを考えてみましょう。"
    },
    {
      text: "あなたは、複数の意見が対立した場合、それぞれの意見の妥当性を検討してから判断しますか？",
      hint: "友人や知人など、誰かと一緒に何かをするときの自分の感じ方を考えてください。"
    },
    {
      text: "あなたは、物事を進める際に、全体の整合性を意識して行動しますか？",
      hint: "自分の行動が、ほかの人の作業や全体の計画と矛盾していないかを考えてみましょう。"
    },
    {
      text: "あなたは、自分の得意なことや強みを具体的に説明できますか？",
      hint: "これまでにうまくできたことや、人から評価されたことを振り返り、自分の強みとして説明できるものがあるかを考えてみましょう。"
    },
    {
      text: "あなたは、将来の目標が明確でなくても、今後どのように行動していくかを考えられますか？",
      hint: "将来の目標がまだ決まっていない場合も含めて、今できることや、これから試してみたいことを考えられるかを振り返ってみましょう。"
    },
    {
      text: "あなたは、複数の人と協力して作業するとき、自分の役割が明確でなくても行動できますか？",
      hint: "グループでの作業を想像し、誰が何をするか決まっていないときに、自分から役割を探すかどうかを考えてみましょう。"
    },
    {
      text: "あなたは、十分な情報がそろっていない場合でも、自分なりの判断を下せますか？",
      hint: "情報が完全にそろうまで待つことと、現時点で得られている情報をもとに判断することを考えてみましょう。"
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