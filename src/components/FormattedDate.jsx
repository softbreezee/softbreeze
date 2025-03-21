
import React from 'react';

const FormattedDate = ({ date }) => {

	return (<time datetime={date?.toISOString()}>
		{
			date.toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		}
	</time>)
}

export default FormattedDate;
