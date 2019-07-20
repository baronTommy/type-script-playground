import {foo} from './sub/foo'

export {
    main,
    sub1,
    sub2
}

function main() {
    return 'I am main'
}

function sub1() {
    return 'I am sub1'
}

function sub2() {
    return {value: 'I am sub2'}
}

function myFoo() {
    foo()
}
