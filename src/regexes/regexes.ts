// Regexes variables
export const regex: RegExp = /\[\[\s*((?:(?:0?[1-9]|[12]\d|3[01])º?\sde\s)?(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|sep?tiembre|octubre|noviembre|diciembre)(?:\sde\s[1-9]\d{0,3})?)|(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)|(?:(?:años?|década de)\s)?(?:[1-9]\d{0,3}|los\s[1-9]0|(?:[1-2]\d{0,2}0s|[1-9]0s)|siglo(?:\s|&nbsp;)*\w+|[IVXLCDM0-9]+º?\smilenio)(?:(?:\s|&nbsp;)*(?:a|d)\.(?:\s|&nbsp;)*C\.)?)\s*\]\]/i;
export const pipeRegex: RegExp = /\[\[\s*((?:(?:0?[1-9]|[12]\d|3[01])º?\sde\s)?(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|sep?tiembre|octubre|noviembre|diciembre)(?:\sde\s[1-9]\d{0,3})?)|(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)|(?:(?:años?|década de)\s)?(?:[1-9]\d{0,3}|los\s[1-9]0|(?:[1-2]\d{0,2}0s|[1-9]0s)|siglo(?:\s|&nbsp;)*\w+|[IVXLCDM0-9]+º?\smilenio)(?:(?:\s|&nbsp;)*(?:a|d)\.(?:\s|&nbsp;)*C\.)?)(?:\s*\|([^\]]*))\s*\]\]/i;
export const templateRegex: RegExp = /(\{\{(?:siglo|(?:Julgreg)?fecha)[^\}]+)(?:\|1|\|Link\s*=\s*(?:\"true\"|(?:s[ií]|pt)))\s*(\}\})/i;

// This one is so that the function that finds the articles can discard them if they're within the calendar-related scope
export const titleRegex: RegExp = /^((?:(?:0?[1-9]|[12]\d|3[01])º? de |Anexo:[\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+ en )?(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|sep?tiembre|octubre|noviembre|diciembre|año|día|mes)?(?:(?: de )?[1-9]\d{0,3})?)|(?:(?:Anexo:)?(?:Cronología|Día|Mes|Década|Siglo) de[\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+)|(?:(?:Anexo:)?(Años?|Día (?:mundial|(?:inter)?nacional|europeo)) [\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+)|(?:(Calendario|Semana) [\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+)|(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)|(?:(?:años?|década de)\s)?(?:[1-9]\d{0,3}(?: \(desambiguación\))?|siglo(?:\s|&nbsp;)*\w+|[IVXLCDM0-9]+º?\smilenio)(?:(?:\s|&nbsp;)*(?:a|d)\.(?:\s|&nbsp;)*C\.)?)$/i;