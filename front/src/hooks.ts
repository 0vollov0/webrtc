import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './stores/store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()