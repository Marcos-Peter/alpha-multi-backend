function getDateWithoutTimeZone (date?: string)
{
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const moment = date ? new Date(date).getTime() : Date.now();
    const now = new Date(moment - timezoneOffset);

    return now;
}

export { getDateWithoutTimeZone };
