import { connect } from 'react-redux'
import InputBox from '../ui/InputBox'
import {requestShortenedLink} from '../../store/actions'

const mapStateToProps = (state, props) => {
	return {
		value: state.input.value,
		dirty: state.input.dirty,
		valid: state.input.valid,
		submitted: state.input.submitted
	}
}

const mapDispatchToProps = dispatch =>
	({
		submitLink(link, token) {
			dispatch(requestShortenedLink(link, token))
		}
	})
}

export default connect(mapStateToProps, mapDispatchToProps)(InputBox)