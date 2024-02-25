import Block from '../../services/Block';
import tpl from './tpl.hbs?raw';
import './styles.scss';

// Type InputProps = {
// 	type: string;
// 	name: string;
// 	isRequired: true;
// 	text: string;
// 	value?: string;
// 	events?: Record<string, unknown>;
// };

export default class Input extends Block {
	// ComponentDidUpdate(oldProps: any, newProps: any): boolean {
	//     this.setProps()
	// }
	render() {
		return this.compile(tpl, this.props);
	}
}
