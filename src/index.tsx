//上面这几个可以单独打包
import  React  from 'react';
import  ReactDOM  from 'react-dom';

var container = document.getElementById('root');
interface HInputProps{
    defaultValue?:string
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>any
}
interface HInputState{
    value:string
}
class HInput extends React.Component<HInputProps,HInputState> {
    constructor(props:HInputProps) {
        super(props);

        this.state = {
            value: this.props.defaultValue || ''
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e:React.ChangeEvent<HTMLInputElement>) {
        console.log('onChange',e.target.value);
        this.setState({
            value: e.target.value
        });

        this.props.onChange && this.props.onChange(e);
    } 

    render() {
        return (
            <div className="h-input-wrapper">
                <input value={this.state.value} onChange={this.onChange} className="h-input" />
                <p>{this.state.value}</p>
            </div>
        );
    }
}
ReactDOM.render(<div style={{height: 400}}><HInput /></div>, container );