export default function ResultDisplay({ result }) {
  return <div className="result">{result && `🎉 ${result}`}</div>;
}
