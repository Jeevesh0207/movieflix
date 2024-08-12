import React from 'react';

function Footer() {
	return (
		<footer className='py-6 md:px-8 md:py-4 bg-black text-white border-t border-gray-800 flex items-center justify-center'>
			<div className='text-center'>
				<p className='text-sm leading-loose text-muted-foreground'>
					Built by{" "}
					<a
						href='https://github.com/aryan262'
						target='_blank'
						className='font-medium underline underline-offset-4'
					>
						Aryan Panchal
					</a>
					.
				</p>
			</div>
		</footer>
	);
}

export default Footer;
