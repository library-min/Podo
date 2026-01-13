import axios from 'axios';

/**
 * Axios 글로벌 설정
 *
 * 🎯 목적:
 * 1. 모든 API 요청에 Authorization 헤더 자동 추가
 * 2. 401 응답(세션 만료) 시 자동으로 로그아웃 및 메인페이지로 리다이렉트
 *
 * 📌 동작 흐름:
 * - 요청 전: localStorage의 토큰을 Authorization 헤더에 추가
 * - 응답 후: 401 에러 시 로그아웃 처리 및 메인페이지로 이동
 */

// ✅ 요청 인터셉터: 모든 API 호출에 Authorization 헤더 자동 추가
axios.interceptors.request.use(
    (config) => {
        // localStorage에서 토큰 가져오기
        const token = localStorage.getItem('token');

        // 토큰이 있으면 Authorization 헤더에 추가
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ⚠️ 응답 인터셉터: 401 에러(세션 만료) 시 자동 로그아웃
axios.interceptors.response.use(
    (response) => {
        // 정상 응답은 그대로 통과
        return response;
    },
    (error) => {
        // 401 Unauthorized 에러 (세션 만료 또는 로그인 필요)
        if (error.response?.status === 401) {
            // 현재 경로가 로그인/회원가입 페이지가 아닌 경우에만 처리
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/signup') {
                console.warn('⚠️ 세션이 만료되었습니다. 로그아웃 처리 중...');

                // 로그아웃 처리: localStorage 초기화
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userNickname');
                localStorage.removeItem('userRole');
                localStorage.removeItem('isLoggedIn');

                // 메인페이지로 리다이렉트
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

// 기본 설정 (선택 사항)
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.timeout = 10000; // 10초 타임아웃

export default axios;
