export function BlurredBackground() {
  return (
    <div className="fixed inset-0 opacity-15 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[30vw] h-[30vw] rounded-full blur-[80px] animate-wander-1"
        style={{
          background: 'rgba(234, 0, 4, 1)',
          bottom: '10%',
          right: '20%',
        }}
      />
      <div
        className="absolute w-[25vw] h-[25vw] rounded-full blur-[80px] animate-wander-2"
        style={{
          background: 'rgba(0, 214, 161, 1)',
          top: '15%',
          right: '25%',
        }}
      />
      <div
        className="absolute w-[50vw] h-[50vw] rounded-full blur-[80px] animate-wander-3"
        style={{
          background: 'rgba(250, 197, 65, 1)',
          top: '20%',
          left: '10%',
        }}
      />
    </div>
  );
}
