import { compile } from 'handlebars';
import tpl from './tpl.hbs?raw';
import './styles.scss'
import validateInput from '../../utils/validateInput';

const mockCredentials = {
    login: 'login',
    password: 'password'
}

export default (props = {}) => {
    
    const script = () => {
        document.querySelector('.form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isFormValid = [
                validateInput('login', (val) => val === mockCredentials.login, 'Неверный логин'),
                validateInput('password', (val) => val === mockCredentials.password, 'Неверный пароль')
            ].filter(val => !val).length === 0;

            if (isFormValid) {
                window.location.href = 'chat';
            }
        })
    }
    
    return {
        html: compile(tpl)(props),
        js: script
    }
}