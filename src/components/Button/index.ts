import Block from '../../services/Block';
import tpl from './tpl.hbs?raw';
import './styles.scss';

// Type ButtonProps = {
// 	text: string;
// };

export default class Button extends Block {
	render() {
		return this.compile(tpl, this.props);
	}
}
