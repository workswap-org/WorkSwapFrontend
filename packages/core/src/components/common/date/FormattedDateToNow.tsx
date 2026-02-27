import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export const FormattedDateToNow = ({date}: {date: string}) => {
    return (
        <div id='date'>
            {formatDistanceToNow(
                new Date(date.endsWith('Z') ? date : date + 'Z'), 
                { 
                    addSuffix: true, 
                    locale: ru 
                }
            )}
        </div>
    )
}
