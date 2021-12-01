

export interface AlertProps {
   alert: string
}

export default function Alert(props: AlertProps) {
   const alert = props.alert;

   return <div className='alert'>
      <div dangerouslySetInnerHTML={{ __html: alert }}/>
   </div>;
} 