import { regex, pipeRegex, templateRegex, titleRegex } from '../src/regexes/regexes'
import { categories } from '../src/categories/categories'

describe('Regex matches', () => {

    test('Regex should match years with up to 4 digits', () => {
        const inputArray = [
            '[[1996]]',
            '[[ 645]]',
            '[[ 30]]',
            '[[19 ]]',
            '[[ 144 ]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match «a.C.» and «d.C.» dates', () => {
        const inputArray = [
            '[[4 a. C.]]',
            '[[6 d.C.]]',
            '[[199 a.C.]]',
            '[[ 1344 a. c.]]',
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match years with words attached', () => {
        const inputArray = [
            '[[Año 1993]]',
            '[[ año 88 a. c.]]',
            '[[año 1555 d.&nbsp;C. ]]',
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match &nbsp; in the «a. C.»/«a. D.» cases', () => {
        const inputArray = [
            '[[4&nbsp;a.&nbsp;C.]]',
            '[[6&nbsp;a. C.]]',
            '[[199 a.&nbsp;C.]]',
            '[[ 1344 a. &nbsp;C.]]',
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match days', () => {
        const inputArray = [
            '[[1 de enero]]',
            '[[10 de enero]]',
            '[[31 de agosto]]',
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should not match days that are above 31', () => {
        const inputArray = [
            '[[40 de enero]]',
            '[[71 de noviembre]]',
            '[[32 de agosto]]'
        ];
        expect(inputArray.some(e => regex.test(e))).toBeFalsy();
    })

    test('Regex should match millenia', () => {
        const inputArray = [
            '[[IV milenio]]',
            '[[4º milenio]]',
            '[[II milenio a. C.]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match millenia if the number has been spelled out', () => {
        const inputArray = [
            '[[cuarto milenio]]',
            '[[sexto milenio]]',
            '[[viǵesimo milenio a. C.]]'
        ];
        expect(inputArray.some(e => regex.test(e))).toBeFalsy();
    })

    test('Regex should match centuries', () => {
        const inputArray = [
            '[[Siglo IX]]',
            '[[siglo VIII]]',
            '[[siglo 13]]',
            '[[Siglo 4]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match decades', () => {
        const inputArray = [
            '[[Década de 1940]]',
            '[[años 40]]',
            '[[años 1980]]',
            '[[los 60]]',
            '[[década de los 50]]',
            '[[década del 2000]]',
            '[[40s]]',
            '[[2010s]]',
            '[[20s ]]',
            '[[ 30s]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should not match decades that do not exist', () => {
        const inputArray = [
            '[[los 6000]]',
            '[[los 61]]',
            '[[los 99 ]]',
            '[[los 1 ]]',
            '[[los 4]]',
            '[[los 0]]',
            '[[3400s]]',
            '[[0s]]',
            '[[84s]]',
            '[[1999s]]',
        ];
        expect(inputArray.some(e => regex.test(e))).toBeFalsy();
    })

    test('Regex should match months', () => {
        const inputArray = [
            '[[enero]]',
            '[[febrero]]',
            '[[Marzo]]',
            '[[Abril]]',
            '[[Mayo]]',
            '[[Junio]]',
            '[[Julio]]',
            '[[Agosto]]',
            '[[Septiembre]]',
            '[[Setiembre]]',
            '[[Octubre]]',
            '[[Noviembre]]',
            '[[Diciembre]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match days of the week', () => {
        const inputArray = [
            '[[lunes]]',
            '[[martes]]',
            '[[miércoles]]',
            '[[jueves]]',
            '[[viernes]]',
            '[[sábado]]',
            '[[domingo]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

})
