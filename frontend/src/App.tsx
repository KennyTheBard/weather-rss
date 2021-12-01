import moment from 'moment';
import React from 'react';
import './App.scss';
import Alert from './components/alert';
import ForecastCountry from './components/forecast-country';
import DataService from './services/data-service';
import { AppData } from './type';


export default class App extends React.Component {

  state: AppData & {[key: string]: any} = {
    forecasts: [],
    alerts: [],
    isLoading: false,
  };

  componentDidMount() {
    this.refreshData();

    setInterval(this.updateRefreshCount, 1000);
  }

  refreshData = async () => {
    this.setState({
      isLoading: true
    });

    const data = await DataService.getFreshData();

    console.log(data.timestamp);

    this.setState({
      forecasts: data.forecasts,
      alerts: data.alerts,
      timestamp: data.timestamp,
      isLoading: false
    });
  }

  updateRefreshCount = () => {
    this.setState({
      secondsSinceFreshData:  Math.floor(moment().diff(moment(this.state.timestamp), 'second', true))
    });
  }

  formatSecondsToHours = (seconds: number): string => {
    const formatNumber = (x: number) => x.toLocaleString('en-US', {
      minimumIntegerDigits: 2
    });

    if (seconds < 60) {
      return `${seconds} seconds`
    }

    if (seconds < 60 * 60) {
      return `${Math.floor(seconds / 60)}:${formatNumber(seconds % 60)} minutes`
    }

    return `${Math.floor(seconds / (60 * 60))}:${formatNumber(Math.floor(seconds / 60))}:${formatNumber(seconds % 60)} hours`
  }

  render() {
    return (
      <div>
        <div className='refresh-container'>
          <input type="button" onClick={this.refreshData} value={'Refresh' + (this.state.secondsSinceFreshData ? ` (${this.formatSecondsToHours(this.state.secondsSinceFreshData)} old)` : '')} disabled={this.state.isLoading} />
        </div>
        <div className='content'>
          <div className='forecast'>
            {this.state.forecasts.map((f, i) => <ForecastCountry key={i} forecast={f}></ForecastCountry>)}
          </div>
          <div className='alerts'>
            {this.state.alerts.map((a, i) => <Alert alert={a}></Alert>)}
          </div>
        </div>
      </div>
    );
  }
}

