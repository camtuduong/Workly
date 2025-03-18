export default function AuthBackground() {
  return (
    <div className="flex w-6/10 flex-col justify-between bg-[url(/images/bg.png)] bg-cover p-10 text-white">
      <div className="mb-auto">
        <div className="flex items-center">
          <span className="text-xl font-bold">Workly</span>
        </div>
      </div>
      <div className="self-start">
        <h1
          className="ha text-4xl font-bold"
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}
        >
          SIGN IN TO YOUR <br />
          <span className="text-purple-600">ADVENTURE!</span>
        </h1>
      </div>
    </div>
  );
}
