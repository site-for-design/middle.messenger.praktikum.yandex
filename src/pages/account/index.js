import { compile } from 'handlebars';
import tpl from './tpl.hbs?raw';
import addEventListenerAll from '../../utils/addEventListenerAll';
import './styles.scss'

export default (props = {}) => {
    const script = () => {

        addEventListenerAll(document.querySelectorAll('[data-click="toggleAccountVisibility"]'), 'click', () => {
            const accountModal = document.querySelector('section#account');
            accountModal.classList.toggle('active')
        })
        
        // addEventListenerAll(document.querySelectorAll('[data-click="editUserInfo"]'), 'click', () => {
        //     const userInfoInputs = document.querySelectorAll('.user-info li input');
        //     userInfoInputs.forEach(el => {
        //         el.disabled = !el.disabled;
        //     })
        // })

        // edit User Info Start
        document.querySelector('.user-info').addEventListener('submit', (e) => {
            e.preventDefault()
            document.querySelector('section#account').removeAttribute('data-edit')
            const userInfoInputs = document.querySelectorAll('.user-info li input');
            userInfoInputs.forEach(el => {
                el.disabled = !el.disabled;
            })
        })
        
        document.querySelector('[data-click="editPassword"]').addEventListener('click', () => {
            document.querySelector('section#account').setAttribute('data-edit', 'password');
            const userInfoInputs = document.querySelectorAll('.user-info li input');
            userInfoInputs.forEach(el => {
                el.disabled = !el.disabled;
            })
        })

        document.querySelector('[data-click="editUserInfo"]').addEventListener('click', () => {
            document.querySelector('section#account').setAttribute('data-edit', 'userInfo');
            const userInfoInputs = document.querySelectorAll('.user-info li input');
            userInfoInputs.forEach(el => {
                el.disabled = !el.disabled;
            })
        })
        // edit User Info End

        document.querySelector('.modal.change-avatar form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (e.target[0]?.files[0]) {
                document.querySelector('.modal.change-avatar .error').style.display = 'none';
            } else {
                document.querySelector('.modal.change-avatar .error').style.display = 'block';

            }
        })

        document.querySelector('.modal.change-avatar form [name="avatar"]').addEventListener('change', function(e) {
            const image = e.target.files?.[0];
            const filename = e.target.parentElement.querySelector('.filename');
            if (image.type?.split('/')[0] === 'image') {
                filename.innerHTML = image.name;
                filename.style.display = 'block';
                document.querySelector('.modal.change-avatar .label').style.display = 'none';

                document.querySelector('.modal.change-avatar .title').style.display = 'block';
                document.querySelector('.modal.change-avatar .error-title').style.display = 'none';
            } else {
                filename.style.display = 'none';
                document.querySelector('.modal.change-avatar .label').style.display = 'block';

                document.querySelector('.modal.change-avatar .title').style.display = 'none';
                document.querySelector('.modal.change-avatar .error-title').style.display = 'block';
            }
            return false
        })
    }

    return {
        html: compile(tpl)(props),
        js: script
    }
}