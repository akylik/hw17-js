import React, { Component } from "react";
import "./timer.css";

export default class Timer extends Component {
  state = {
    from: 4,
    beginDate: Date.now(),
    autoStart: false,
    infinity: true,
    pause: false,
    action: false,
    waitingDate: 0,
    electron: "",
    startButton: "Start",
    intervalID: 0,
    circleSVG: {
      strokeDashoffset: "0",
      strokeDasharray: 2 * Math.PI * 100,
    },
  };

  componentDidMount = () => {
    this.setState({ from: this.props.from });
    this.setState({ infinity: this.props.infinity });
    this.setState({ autoStart: this.props.autoStart });
    this.calcElectron(this.props.from);
    if (this.props.autoStart) this.initClock();
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
    this.setState({ action: false });
  };

  onTimeEnd = () => console.log("Час вийшов!");
  onTimeStart = () => console.log("Таймер запущено!");
  onTimePause = () => console.log("Таймер на паузі!");

  initClock = async () => {
    if (this.state.action && !this.state.pause) {
      this.onTimePause();
      await this.setState({ waitingDate: Date.now() });
      await this.setState({ startButton: "Start" });
      await this.setState({ pause: true });
      clearInterval(this.state.intervalID);
    } else {
      if (this.state.action && this.state.pause) {
        await this.setState({
          waitingDate: Date.now() - this.state.waitingDate,
        });
        await this.setState({
          beginDate: this.state.beginDate + this.state.waitingDate,
        });
        await this.setState({ waitingDate: 0 });
        await this.setState({ startButton: "Pause" });
        await this.setState({ pause: false });
      } else {
        this.onTimeStart();
        await this.setState({ beginDate: Date.now() });
        await this.setState({ startButton: "Pause" });
        await this.setState({ action: true });
        await this.setState({ pause: false });
        await this.setState({ circleSVG: { strokeDashoffset: 0 } });
      }
      this.setState({
        intervalID: setInterval(async () => {
          this.calcElectron();
          const curTime = Date.now() - this.state.beginDate;
          if (curTime > this.state.from * 1000) {
            this.onTimeEnd();
            if (this.state.infinity) {
              this.setState({ beginDate: Date.now() });
              this.setState({ pause: 0 });
              this.setState({ circleSVG: { strokeDashoffset: 0 } });
            } else {
              clearInterval(this.state.intervalID);
              this.setState({ action: false });
              this.setState({ startButton: "Start" });
            }
          }
        }),
      });
    }
  };

  calcElectron = (init = undefined) => {
    let calcTime = init;
    let ele;
    let tempTime;
    if (!init) {
      tempTime = Date.now() - this.state.waitingDate - this.state.beginDate;
      calcTime = (this.state.from - tempTime / 1000).toFixed();
    }
    ele = calcTime >= 10 ? calcTime.toString() : "0" + Math.abs(calcTime);
    if (this.state.action || init) this.setState({ electron: ele });
    else this.setState({ electron: "00" });

    const pos = (
      (tempTime * 2 * Math.PI * 100) /
      this.state.from /
      1000
    ).toFixed();
    this.setState({ circleSVG: { strokeDashoffset: pos } });
  };

  countDownButton = async (e) => {
    let checkValue = +e.target.value;
    if (checkValue > 99) checkValue = 99;
    if (checkValue < 1) checkValue = 1;
    await this.setState({ from: checkValue });
    this.calcElectron(this.state.from);
  };

  render() {
    return (
      <div className="bg">
        <div className="container">
          <div className="count-down">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
              <circle
                className="stroke"
                cx="110"
                cy="110"
                r="100"
                style={this.state.circleSVG}
              />
            </svg>
            <span className="digits-overlay" onClick={this.out}>
              {this.state.electron}
            </span>
            <label className="inputCD">
              Timer (s):
              <br />
              <input
                id="countDown_btn"
                type="number"
                min="1"
                max="99"
                value={this.state.from}
                onChange={this.countDownButton}
              ></input>
            </label>
            <p className="auto_start">
              {this.state.autoStart ? "autostart" : ""}
            </p>
            <button className="start_btn" onClick={this.initClock}>
              {this.state.startButton}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
