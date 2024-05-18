interface IConfig {
  signalHost: string;
}

console.log('export')

export const config:IConfig = {
  signalHost: "ws://localhost:8080"
};