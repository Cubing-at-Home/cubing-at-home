import React from 'react'
import MUISnackbar, { SnackbarProps } from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

export default function Snackbar(props: SnackbarProps) {
	const [open, setOpen] = React.useState(true)

	const handleClose = (
		event: React.SyntheticEvent | React.MouseEvent,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	return (
		<MUISnackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={open}
			autoHideDuration={3000}
			onClose={handleClose}
			action={
				<React.Fragment>
					<IconButton
						size='small'
						aria-label='close'
						color='inherit'
						onClick={handleClose}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				</React.Fragment>
			}
			{...props}
		/>
	)
}
