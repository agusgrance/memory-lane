import { useState, useEffect } from 'react'

interface ScrollToTopHook {
    isVisible: boolean
    scrollToTop: () => void
}

export const useScrollToTop = (threshold = 300): ScrollToTopHook => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > threshold)
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [threshold])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return { isVisible, scrollToTop }
} 