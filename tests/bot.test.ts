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
            '[[17º de octubre ]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should NOT match days that are above 31', () => {
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
            '[[viǵesimo milenio a. C.]]',
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

    test('Regex should NOT match decades that do not exist', () => {
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
            '[[Viernes]]',
            '[[Sábado]]',
            '[[domingo]]'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

    test('Regex should match tc templates that include dates inside', () => {
        const inputArray = [
            '{{tc|lunes}}',
            '{{tc|1997}}',
            '{{tc|Octubre}}',
            '{{tc|8 de marzo}}',
            '{{tc|los 70}}'
        ];
        expect(inputArray.every(e => regex.test(e))).toBeTruthy();
    })

})

describe('pipeRegex matches', () => {

    test('pipeRegex should match years with up to 4 digits', () => {
        const inputArray = [
            '[[1996|some pipe]]',
            '[[ 645|some pipe]]',
            '[[ 30|some pipe]]',
            '[[19 |some pipe]]',
            '[[ 144 |some pipe]]'
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should match «a.C.» and «d.C.» dates', () => {
        const inputArray = [
            '[[4 a. C.|some pipe]]',
            '[[6 d.C.|some pipe]]',
            '[[199 a.C.|some pipe]]',
            '[[ 1344 a. c.|some pipe]]',
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should match years with words attached', () => {
        const inputArray = [
            '[[Año 1993|some pipe]]',
            '[[ año 88 a. c.|some pipe]]',
            '[[año 1555 d.&nbsp;C. |some pipe]]',
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should match &nbsp; in the «a. C.»/«a. D.» cases', () => {
        const inputArray = [
            '[[4&nbsp;a.&nbsp;C.|some pipe]]',
            '[[6&nbsp;a. C.|some pipe]]',
            '[[199 a.&nbsp;C.|some pipe]]',
            '[[ 1344 a. &nbsp;C.|some pipe]]',
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should match days', () => {
        const inputArray = [
            '[[1 de enero|some pipe]]',
            '[[10 de enero|some pipe]]',
            '[[31 de agosto|some pipe]]',
            '[[17º de octubre |some pipe]]'
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should NOT match days that are above 31', () => {
        const inputArray = [
            '[[40 de enero|some pipe]]',
            '[[71 de noviembre|some pipe]]',
            '[[32 de agosto|some pipe]]'
        ];
        expect(inputArray.some(e => pipeRegex.test(e))).toBeFalsy();
    })

    test('pipeRegex should match millenia', () => {
        const inputArray = [
            '[[IV milenio|some pipe]]',
            '[[4º milenio|some pipe]]',
            '[[II milenio a. C.|some pipe]]'
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should match millenia if the number has been spelled out', () => {
        const inputArray = [
            '[[cuarto milenio|some pipe]]',
            '[[sexto milenio|some pipe]]',
            '[[viǵesimo milenio a. C.|some pipe]]',
        ];
        expect(inputArray.some(e => pipeRegex.test(e))).toBeFalsy();
    })

    test('pipeRegex should match centuries', () => {
        const inputArray = [
            '[[Siglo IX|some pipe]]',
            '[[siglo VIII|some pipe]]',
            '[[siglo 13|some pipe]]',
            '[[Siglo 4|some pipe]]'
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should match decades', () => {
        const inputArray = [
            '[[Década de 1940|some pipe]]',
            '[[años 40|some pipe]]',
            '[[años 1980|some pipe]]',
            '[[los 60|some pipe]]',
            '[[década de los 50|some pipe]]',
            '[[década del 2000|some pipe]]',
            '[[40s|some pipe]]',
            '[[2010s|some pipe]]',
            '[[20s |some pipe]]',
            '[[ 30s|some pipe]]'
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should NOT match decades that do not exist', () => {
        const inputArray = [
            '[[los 6000|some pipe]]',
            '[[los 61|some pipe]]',
            '[[los 99 |some pipe]]',
            '[[los 1 |some pipe]]',
            '[[los 4|some pipe]]',
            '[[los 0|some pipe]]',
            '[[3400s|some pipe]]',
            '[[0s|some pipe]]',
            '[[84s|some pipe]]',
            '[[1999s|some pipe]]',
        ];
        expect(inputArray.some(e => pipeRegex.test(e))).toBeFalsy();
    })

    test('pipeRegex should match months', () => {
        const inputArray = [
            '[[enero|some pipe]]',
            '[[febrero|some pipe]]',
            '[[Marzo|some pipe]]',
            '[[Abril|some pipe]]',
            '[[Mayo|some pipe]]',
            '[[Junio|some pipe]]',
            '[[Julio|some pipe]]',
            '[[Agosto|some pipe]]',
            '[[Septiembre|some pipe]]',
            '[[Setiembre|some pipe]]',
            '[[Octubre|some pipe]]',
            '[[Noviembre|some pipe]]',
            '[[Diciembre|some pipe]]'
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

    test('pipeRegex should match days of the week', () => {
        const inputArray = [
            '[[lunes|some pipe]]',
            '[[martes|some pipe]]',
            '[[miércoles|some pipe]]',
            '[[jueves|some pipe]]',
            '[[Viernes|some pipe]]',
            '[[Sábado|some pipe]]',
            '[[domingo|some pipe]]'
        ];
        expect(inputArray.every(e => pipeRegex.test(e))).toBeTruthy();
    })

})

describe('templateRegex matches', () => {

    test('templateRegex should match the last argument «1» in «siglo» template', () => {
        const inputArray = [
            "{{siglo|III|a|s|1}}",
            "{{SIGLO|VIII|a|s| 1}}"
        ];
        expect(inputArray.every(e => templateRegex.test(e))).toBeTruthy();
    })

    test('templateRegex should match the «link» parameter in «julgregfecha» template', () => {
        const inputArray = [
            "{{Julgregfecha|11|1|1583|Link=\"true\"}} ",
            "{{Julgregfecha|10|12|1443|Link='true'}}",
            "{{julgregfecha||link=\"true\"}}",
            "{{ JULGREGFECHA|30|2|1990|LINK=\"true\"}}",
            "{{julgregfecha|22|1|133|link= true }}",
            "{{julgregfecha|01|06|99|link=true}}"
        ];
        expect(inputArray.every(e => templateRegex.test(e))).toBeTruthy();
    })

    test('templateRegex should match the «enlace» parameter in «fecha» template', () => {
        const inputArray = [
            "{{Fecha|||1993|link=sí}}",
            "{{Fecha||2|1993|link=sí}}",
            "{{Fecha|18|8|2007|24|2|1993|link=pt}}",
            "{{Fecha|24|2|link=si}}"
        ];
        expect(inputArray.every(e => templateRegex.test(e))).toBeTruthy();
    })

    test('templateRegex should NOT match «siglo» templates that do not include a date', () => {
        const inputArray = [
            "{{  siglo|VII|s}}",
            "{{siglo|VII|s|0}}",
            "{{siglo|I||A}}",
            "{{siglo|I|d |a }}",
            "{{siglo|XIX||s}}"
        ];
        expect(inputArray.every(e => templateRegex.test(e))).toBeFalsy();
    })

    test('templateRegex should NOT match «julgregfecha» templates that do not include a date', () => {
        const inputArray = [
            "{{julgregfecha|01|09|993}}",
            "{{julgregfecha|01|06|99|link=no}}",
            "{{julgregfecha|01|06|99|link=}}",
            "{{Julgregfecha|{{LOCALDAY}}|{{LOCALMONTH}}|{{LOCALYEAR}}",
            "{{Julgregfecha|3|1|1696|cambiodeaño=-4}}"
        ];
        expect(inputArray.every(e => templateRegex.test(e))).toBeFalsy();
    });

    test('templateRegex should NOT match fecha templates that do not include a date', () => {
        const inputArray = [
            "{{Fecha|24|2|1993|edad}}",
            "{{Fecha|18|8|2007|24|2|1993}}",
            "{{  fecha|24|2}}",
            "{{Fecha| 3=1993 }}",
            "{{Fecha|18|8|2007|24|2|1993|link=no}}"
        ];
        expect(inputArray.every(e => templateRegex.test(e))).toBeFalsy();
    });

})