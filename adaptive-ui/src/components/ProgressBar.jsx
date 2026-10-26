function ProgressBar({ current, total }) {

    return (

        <div className="progress">
            <p>質問 {current} / {total}</p>
        </div>

    );

}

export default ProgressBar;