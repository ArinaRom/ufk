import React from 'react'

const ContentContainer = ({title, withoutGap, children}) => {
	return (
		<div className={'content__wrapper' + (withoutGap ? " content__wrapper--without-gap" : '')}>
			{title && (<h4 className='content__title'>{title}</h4>)}
			<div className="content">
				{children}
			</div>
		</div>
	)
}

export default ContentContainer
