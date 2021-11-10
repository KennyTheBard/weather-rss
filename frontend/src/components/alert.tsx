import { AlertData } from '../type';


export interface AlertProps {
   alert: AlertData
}

export default function Alert(props: AlertProps) {
   const alert = props.alert;

   return <div className='alert'>
      <div className={'alert-color ' + alert.code.toLowerCase()}>
         COD {alert.code}
      </div>
      <div className='alert-datetime'>
         {alert.date} ({alert.betweenHours})
      </div>
      <div className='alert-zones'>
         {alert.zones}
      </div>
      <div className='alert-description'>
         {alert.description}
      </div>

   </div>;
} 