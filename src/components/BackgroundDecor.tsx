const BackgroundDecor = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl" />
    <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
  </div>
);

export default BackgroundDecor;
