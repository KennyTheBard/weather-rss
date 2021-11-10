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
    isLoading: false
  };

  componentDidMount() {
    this.refreshData();
  }

  refreshData = async () => {
    this.setState({
      isLoading: true
    });

    const data = await DataService.getFreshData();

    this.setState({
      forecasts: data.forecasts,
      alerts: data.alerts,
      isLoading: false
    });
  }

  render() {
    return (
      <div>
        <div className='refresh-container'>
          <input type="button" onClick={this.refreshData} value='Refresh' disabled={this.state.isLoading} />
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

