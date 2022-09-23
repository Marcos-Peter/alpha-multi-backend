function getDateWithoutTimeZone (date?: string)
{
    const timezoneOffset = new Date().getTimezoneOffset();
    const moment = date ? new Date(date).getTime() : Date.now();
    const now = new Date(moment - (timezoneOffset * 60 * 1000));

    return now;
}

export { getDateWithoutTimeZone };
