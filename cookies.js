export function getCookie(name) 
{
	const cookieArr = document.cookie.split("; ");
	for (let cookie of cookieArr) 
	{
		const [key, value] = cookie.split("=");
		if (key === name) 
		{
			return decodeURIComponent(value);
		}
	}
	return null;
}

export function setCookie(name, value, expireTime, path="") 
{
	let expires = "expires="
	if(expireTime == undefined)
	{
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999); 
		expires += endOfDay.toUTCString();
	}
	else
	{
		expires += new Date(Date.now() + expireTime * 864e5).toUTCString();
	}

	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; SameSite=Lax; path=/${path}`;
}


export function deleteCookie(name, cookiePath) 
{
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}`;
}
function dateToString(date)
{
	return `${date.getDate()},${date.getMonth()},${date.getYear()}`
}

// export function updateStreak(lastSolvedDayCookie, streakCookie, cookiePath)
// {
// 	let date = new Date()
// 	date.setDate(date.getDate() - 1)
// 	let priorSolveDate = getCookie(lastSolvedDayCookie)
// 	if(priorSolveDate != null && priorSolveDate == dateToString(date))
// 	{
// 		let currentStreak = getCookie(streakCookie)
// 		let streakLength = 1
// 		if (currentStreak != null)
// 		{
// 			let parsedStreak =  parseInt(getCookie(currentStreak))
// 			if (parsedStreak != null)
// 			{
// 				streakLength = parsedStreak
// 			}
// 		}
// 		streakLength = streakLength == null ? 1 : streakLength
// 		setCookie(streakCookie, (streakLength + 1).toString(),365,cookiePath)
// 	}
// 	else
// 	{
// 		setCookie(streakCookie, "1",365,cookiePath)
// 	}
// 	setCookie(lastSolvedDayCookie, dateToString(new Date()),365,cookiePath)
// }