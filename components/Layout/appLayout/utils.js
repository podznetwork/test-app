import { useConversationsNewMessages } from "@/lib/app/conversation"
import { usePublicGuestEpisodes } from "@/lib/app/episode"
import { useHostPodcasts } from "@/lib/app/podcast"
import { useRequest } from "@/lib/app/request"
import { useCurrentUser } from "@/lib/app/user"
import Link from "next/link"
import { useRouter } from "next/router"
const Number = number => {
	return (
		<span className="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-rose-700 bg-[#F0BB9B] rounded-full ">
			{number}
		</span>
	)
}

const Logos = logo => {
	const dashboard = () => {
		return (
			<>
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect
						y="0.466797"
						width="18"
						height="18"
						fill="url(#pattern34)"
					/>
					<defs>
						<pattern
							id="pattern34"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image0_741_7476"
								transform="matrix(0.01 0 0 0.009375 0 0.0312501)"
							/>
						</pattern>
						<image
							id="image0_741_7476"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEr0lEQVR4nO2dS4wUVRSGP0Zebn0AMRgUIyFxoSDEhYRHhBgzs9L4gNEtDitAAqwIGGPiUkBcuXEFMYYILidKnIidGFw4iIq6GF32ggFiBBmlzTWnYdLUvdVN131U3/MlZ3erzqn659y+rzoDiqIoiqIoiqIoiqIoipInK4E3gD3A/grsTWAzsKCC2Mw9tgBjFcW2R57VPHNSDAGvAz8CLU92BfgAWHQX8S0GjgFXPcZ3Adgm7yIqDwBnPD5oq8MuA8M9xDciYoaK70vgfiKK8UvAh22J/SN/jWWMAv9GiO9iDFGGAmdGq8OuAasd8a2RNrHi+wKYE1CP/3/MWpGt4XjoswnE100WV8YFRyA3gO+B8T5tArhU8tAbCmLbVHLNJbl3v/GZZ5xx+PkhlBgrHUF8CzxSoa+5wEGHv8MF1xx1tD8A3FNhfI8C5xz+VhCxu7ohAfrgtMXnNwVtG5a2n3mKbbkjU8zAwjv7LM4nPfocs/icKmg7ZWlrJpm+mLT43EsADlmcm1GXL162+GwWtG1a2pp7+MI24jTvyjsqyJ2oIGiG3EIz5E40Q9AMuYVmSGIZkvqwt5nbKMs2MZzxODH8vIeJYXaCuJZOzsnMtcqlk7cd/t4vuCY7QcoWF2ek+6picXHa4cfY+oLYshRktORFhbAJS2xZCjIkmzCxxPgLWGWJLUtBkG3Ki5G2cLc64spWkLYoITNlGnihJKasBUG2UbfKDpnP0yZHgAe7iCd7QWazQs5omX2A9/q0Q8B24Dlgfg9/ICpIYjRz77JSo6mCpEVTBbnNvTI/GJEuoh97CVgHPKSC9I45RfgJ8KenUdZ3wA5gnmaIGzP6+RC4GWge8hPwhHZZ9u8tYiyfXJWuzEa2vyEfRxCjJWZe+jJLXFkKUnZ+NoR9aoktS0HKTpdfl0PN/diVEh/md+vJgtiyE2Sp40f8d+D5LkdD3fAwcNwhyjsF12QnyGsW5+ZrpbWe9l4aFp9fFbT/zdJ2J/741eJzNwF4y+LcfN7mi10Wn+bldzLhOBDh46PMZxw9xisEIPVzWe86urjj0g1WwTzZm/nD0WP0usowkII8VTIYaM9l+h10/H2Xe/7ZCWI42YUovs3s4wShDoIsc4y2QthHBKQOgiDLKyGLBrRtvKJSIAMnCLIQ6bPkR+eP+OEK52ADKUj7OOqYHHP1sSptBggnLKsGQaibILNZAjwLvFjBBtqwiLCQyNRZkIFEBUkMFSQx6irIgkGtKFc3QRYPekW5OgkykkNFuboIMppLRbk6CLImp4pydRDkbEQxgleUS12QTblVlEtdkKO5VZRLXZBGbhXlUhdkytJWK8pFEqSZ27ms1DOkqYKoIGc0Q9AM0S7LjmYImiG1qSg3FWHYez5mIeXUK8o1LG1PeYrtsdgTw9Qryh1xtD8o96yK5fKFcNSlk9Qrym0suWa6osXFyZLFRdONBSPlinKGrxOI71UCknJFOcPTkTeoxkP/y6OUK8q12SZtQ8f3M3AfkUixotxshqX4WcjMiCZGqhXlOlkkm1Y+hTkvH8MG76bqUFHOxny513a5d7/x7ZVnfdzqUVEURVEURVEURVEURVEYXP4DvRVGxfVebxQAAAAASUVORK5CYII="
						/>
					</defs>
				</svg>
			</>
		)
	}
	const documentation = () => {
		return settings()
	}
	const pricing = () => {
		return (
			<>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect
						y="0.0666504"
						width="24"
						height="27"
						fill="url(#pattern35)"
					/>
					<defs>
						<pattern
							id="pattern35"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image0_741_7464"
								transform="matrix(0.01 0 0 0.00937501 0 0.0312496)"
							/>
						</pattern>
						<image
							id="image0_741_7464"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,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"
						/>
					</defs>
				</svg>
			</>
		)
	}
	const landing = () => {
		return (
			<>
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect
						y="0.933105"
						width="18"
						height="18"
						fill="url(#pattern36)"
					/>
					<defs>
						<pattern
							id="pattern36"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image0_741_7484"
								transform="matrix(0.01 0 0 0.009375 0 0.0312502)"
							/>
						</pattern>
						<image
							id="image0_741_7484"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABrElEQVR4nO3cUYrCMAAG4f94K3v/C9i9RxYhvlWMJCbTdj7ok+CWTOMmVppIkiRJEs9vkr8kxSM9Y7AluY0I8ngjY2TIGNxHBDFGho6BQXLyIPqMQWAMAmMQGIPAGARmWZDnjv7VjrT39aNaFmR7syPtff2oDAKzLMitXuWPq/vnC68flf/UYQwCYxAYg8AYBMYgMN6gyvqbUN4xzIWC+COHDIsx5Cuh5w569ZVVDn6c7RsISZKkk2nd2Mz+lfz25t777GVt7/g1a33DDbbRKlcPMnsACux8esevGXUACux8esev2bI/vPjvjGIQGIPAGATGIDAGgTFI5bIXtuwt7kMMssePrMoZApshFM4QGIPAGATGIDAGgTFI5bIXtuwt7tQNssePrMoZApshFM4QGIPAGATGIDAGgTFI5bIXtuwt7tQNssePrMoZApshFM4QGIPAGATGIDAGgcEEmXW8Qj2PbtQBKLDz6R2/Zq1v6IMDYEFmP3nu/uYJbZefIYLNEO0zCIxBYAwCY5CrBfHIVzaQBsmai6ubjxnP0M1sN5/9ninfLEiSJElSVvgHdZtRq2bHsOUAAAAASUVORK5CYII="
						/>
					</defs>
				</svg>
			</>
		)
	}
	const requests = () => {
		return users()
	}
	const users = () => {
		return (
			<>
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect
						x="0.189453"
						width="18"
						height="18"
						fill="url(#pat085123)"
					/>
					<defs>
						<pattern
							id="pat085123"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image0_685_4635"
								transform="matrix(0.0113636 0 0 0.01 -0.0681818 0)"
							/>
						</pattern>
						<image
							id="image0_685_4635"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE+ElEQVR4nO2cS4gdRRSGv4kZxkwSMRGTiSYgWZgYFxMVRRR8RUQFFxoQcaHgQvAxESG4UEY04isiiG58RFFXPlAXUaKjCzEaHzGZzYjGqImo+I4YoplokpaDZ5hLW9Xem9vdc2/3/0HB5XZ3nepzuruqTp1TIIQQQgghhBBCCCGEEEIIIYQQQgghCmEOcBnwILABGAN2eBnz/+zYpX6uKIhzgZeBfUDSZBkHXgLOkVXy4yTg3RaMECvvAMtlmEPnMOBOYH8OxpgofwN3eN2iBWYBrzep5F+97xjz381cY/3MTFmkeWO8n6HMXcATwCVAf+D6fj+2Dvgto55NLktkMB14I6LAP4H7Wxw52blrgb0Zb4o+XxncHVHc58DSNh7lE4DtkbrXtFFvpTkNOBAZHc3Nof65Xle6fhs0nJJD/ZWiB/gooKxtOU/u5nidaTnWZ4kGLg4oaQ+wpAAtLfW60/IulEUm2VDyt/2ugLzXZJB/WRCY/P0EzC5QQUe4jPSkcZ6MAlcFntaHSlDMwwG5V8og8HhAMeeVoJgVAbmPyiD/dRyO+wSxaHoDnmMbFteeb1JK2VGiRnamZH9de2sAv6eU8l6JStmUkm2+r9qzO6WUjSVqZGNKtj0ctee7lFK+KFEjX6Zk2+ez9nyQUsofwLQStDIt4AW2T1jteTow/Dy9BK2cEZD7VO2tAVwbUMy9JShmbUDuNTIIHAccDAw/+wpUTp/LaJRpbVgkg4RHOwlwc4HKWR2Q97aMMckVAQX94o7HvDkmEgxxuQwyia1rfxZQko3ADs9RUVbXhwE5n5Q0susqLggoysqLOfUnfV5XSIY5GkWAdRGF2fxgoA2NLcgILXpMlogzA9gSUdyPwA3upW0WO/fGwGLURNnsMkUG8z3sJ4kUC+cZBgYz6hj0c2KhP4kHO2iFsAWjbM1Q5kT5GRgFXvUy6v/933UfuwzRAv3uykhyLk9GQlBFCyFC23MwhH0GL5LW86EXuNo74VYNsdkDKcpYFq4lS4CbfE4xllrg2u3/2bFVwPFT3VghhBBCCCFaZ6G76Yd83f1Z4IUG14n9fsaPDfm5do3IiUXA9T6v+KGNWfr3bqzrtG5+aLmAq9wBmBRQDvrsfSin3MXKcizwSEYKcxFlr+eJmGzh2JrEfZ6HnkxR2ecrh7Xub8zZd1sLb8QuYAS4B1jpqcyLG7J0e/z3Yj+20s8d8WubfWNuraMj8sRIGnSSKjt99wbbEahdTvZoxXROSKhYZMoyaoA9xbd4llRMGQeA5zz2tqegNpwJPB/ZqKDxbVldUBs6glm+mVjW6Gd9Tm9DsyzzuUzWFlDrPWu3Usz39e7YTW+d4s3FBjOiXRI/djQVYWEkKtHKX76hWCuhPUVhbbjd2xRq66dVGB7Pi+wtMtFhW0fbaSwHvsowSte+KbMzPlOjBQVS58VAhqdgSzdufNaTEUf7Vpd0kjO9Qw/dwyvdFpw9HLmRkQ7pL5plunuRQ/diE8iu4NRIx2jRIEfSffR7WkQS2KymjFzItpgRCWr7tsvd3gO+w0T6vrblnL+SO2sCjd7fDU9Sk3OV0K7aNmzv2CFuyCXyANVhOHB/4506FD4/Ek9bpfyL3khUvt17x3FUaiMZc9ydRfUYTC0Z7OnkPBPb6vVNTx+zzNqqssLv07ZDP3uqGyOEEEIIIYQQQgghhBBCCLL4BwRVJ2JphdhdAAAAAElFTkSuQmCC"
						/>
					</defs>
				</svg>
			</>
		)
	}
	const confirmPodcasts = () => {
		return (
			<>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 18 18"
				>
					<path
						fill="#212121"
						d="M11.3350225,2.06528672 L11.4114434,2.21785146 L11.9878973,3.75083256 C12.0331883,3.87155495 12.128445,3.96681168 12.2491674,4.0121027 L13.7292409,4.567377 C14.3787439,4.81104892 14.7277671,5.50508597 14.5546931,6.16174105 L14.5130513,6.29242912 L13.8244843,7.81525412 C13.7711463,7.93264332 13.7711463,8.06735668 13.8244843,8.18474588 L14.4784161,9.62395408 C14.765382,10.2555242 14.5214203,10.9930791 13.9347133,11.3350225 L13.7821485,11.4114434 L12.2491674,11.9878973 C12.128445,12.0331883 12.0331883,12.128445 11.9878973,12.2491674 L11.432623,13.7292409 C11.1889511,14.3787439 10.494914,14.7277671 9.83825895,14.5546931 L9.70757088,14.5130513 L8.18474588,13.8244843 C8.06735668,13.7711463 7.93264332,13.7711463 7.81525412,13.8244843 L6.37604592,14.4784161 C5.74447583,14.765382 5.00692091,14.5214203 4.66497746,13.9347133 L4.58855657,13.7821485 L4.0121027,12.2491674 C3.96681168,12.128445 3.87155495,12.0331883 3.75083256,11.9878973 L2.27075911,11.432623 C1.62125605,11.1889511 1.27223293,10.494914 1.44530694,9.83825895 L1.4869487,9.70757088 L2.17551567,8.18474588 C2.2288537,8.06735668 2.2288537,7.93264332 2.17551567,7.81525412 L1.52158391,6.37604592 C1.23461797,5.74447583 1.47857965,5.00692091 2.06528672,4.66497746 L2.21785146,4.58855657 L3.75083256,4.0121027 C3.87155495,3.96681168 3.96681168,3.87155495 4.0121027,3.75083256 L4.567377,2.27075911 C4.81104892,1.62125605 5.50508597,1.27223293 6.16174105,1.44530694 L6.29242912,1.4869487 L7.81525412,2.17551567 C7.93264332,2.2288537 8.06735668,2.2288537 8.18474588,2.17551567 L9.62395408,1.52158391 C10.2555242,1.23461797 10.9930791,1.47857965 11.3350225,2.06528672 Z M5.40366451,2.58450635 L4.84839021,4.0645798 C4.71251714,4.42674697 4.42674697,4.71251714 4.0645798,4.84839021 L2.58450635,5.40366451 L2.48652396,5.45496873 C2.31248911,5.57557989 2.24408587,5.80694681 2.33478128,6.00655415 L2.98871304,7.44576235 C3.14872713,7.79792997 3.14872713,8.20207003 2.98871304,8.55423765 L2.32877333,10.0072845 L2.30177484,10.0990074 C2.26399858,10.3073536 2.37923131,10.5193231 2.58450635,10.5963355 L4.0645798,11.1516098 C4.42674697,11.2874829 4.71251714,11.573253 4.84839021,11.9354202 L5.40366451,13.4154937 L5.45496873,13.513476 C5.57557989,13.6875109 5.80694681,13.7559141 6.00655415,13.6652187 L7.44576235,13.011287 C7.79792997,12.8512729 8.20207003,12.8512729 8.55423765,13.011287 L10.0072845,13.6712267 L10.0990074,13.6982252 C10.3073536,13.7360014 10.5193231,13.6207687 10.5963355,13.4154937 L11.1516098,11.9354202 C11.2874829,11.573253 11.573253,11.2874829 11.9354202,11.1516098 L13.4154937,10.5963355 L13.513476,10.5450313 C13.6875109,10.4244201 13.7559141,10.1930532 13.6652187,9.99344585 L13.011287,8.55423765 C12.8512729,8.20207003 12.8512729,7.79792997 13.011287,7.44576235 L13.6712267,5.99271553 L13.6982252,5.90099257 C13.7360014,5.69264638 13.6207687,5.48067687 13.4154937,5.40366451 L11.9354202,4.84839021 C11.573253,4.71251714 11.2874829,4.42674697 11.1516098,4.0645798 L10.5963355,2.58450635 L10.5450313,2.48652396 C10.4244201,2.31248911 10.1930532,2.24408587 9.99344585,2.33478128 L8.55423765,2.98871304 C8.20207003,3.14872713 7.79792997,3.14872713 7.44576235,2.98871304 L6.00655415,2.33478128 L5.97868188,2.32323621 C5.74774746,2.2365973 5.49030342,2.35357193 5.40366451,2.58450635 Z M6.97824598,9.34665508 L10.1638976,5.70591039 C10.3263188,5.52028615 10.6084654,5.50147638 10.7940896,5.66389759 C10.9565108,5.80601614 10.9912147,6.03979944 10.8885433,6.2203784 L10.8361024,6.29408961 L7.33610241,10.2940896 C7.18724716,10.4642099 6.93964087,10.4930998 6.75768628,10.3752853 L6.68420455,10.3157955 L5.18420455,8.81579545 C5.00979554,8.64138644 5.00979554,8.35861356 5.18420455,8.18420455 C5.33681243,8.03159666 5.5723864,8.01252068 5.74573581,8.12697659 L5.81579545,8.18420455 L6.97824598,9.34665508 L10.1638976,5.70591039 L6.97824598,9.34665508 Z"
					/>
				</svg>
			</>
		)
	}

	const mediaz = () => {
		return (
			<svg
				width="23"
				height="25"
				viewBox="0 0 23 25"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
			>
				<rect
					x="0.189453"
					width="20"
					height="20"
					fill="url(#pattern37)"
				/>
				<defs>
					<pattern
						id="pattern37"
						patternContentUnits="objectBoundingBox"
						width="1"
						height="1"
					>
						<use
							xlinkHref="#image0_714_14729"
							transform="matrix(0.0111111 0 0 0.00985825 0 0.0563786)"
						/>
					</pattern>
					<image
						id="image0_714_14729"
						width="90"
						height="90"
						xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB2ElEQVR4nO3aTUoDURDE8V7Nxgv4cQQvlVMYb+B4ipxqbuDEC7hx1SLzBAkZxVhPUu3/B70JjyYphhcYKgIAAAAAAOB/GyLiMSL2EZE/nDkixraj6n6Z8YQvmAczFt4vc8qTkAfzXHi/TIqm6n4Z9yCSoBcE/U0QrxFxFxHXbbbtsxQ9cb3Pf8yuzdleHe/BHtqaBT1FxEWb6VyDvjpy9tIo6JeIuP107rZ9dnZBv18Xh26Mgt4cObtxuTruTYLefXF+7b7ubu2Hvbaw3f4Mp3Ynr1m7r7tL0VTdL+MeRBL0gqCbWRDGU9TdL6N4zfhQeL/M0L7s3PHF/Gi8HwAAwIx772Kg17Gg11Gkd7HvvF8mRVN1v4x7EEnQC4L+o15EmvdGZHr3ItK8NyLTuxeR5r0Rmd69iDTvjcj07kWkeW9EpncvIs17IzIpmqr7ZdyDSIJeEHSR3sXceb+Me+9i7Lxfxr13MdDrAAAAqNS7GOh1LOh1FOld7Dvvl0nRVN0v4x5EEvSCoL8JYk2Kn7hz742UCHoy6I3YB/1i0huxD3pj0huxDnpn1BuxDXoy643IpGiq7pdxDyIJekHQRXoXc+f9Mu69i7Hzfhn33sVArwMAAAAAACB+5Q1S6/7j4i6fSAAAAABJRU5ErkJggg=="
					/>
				</defs>
			</svg>
		)
	}

	const messages = () => {
		return (
			<>
				<svg
					width="22"
					height="22"
					viewBox="0 0 22 22"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect
						x="0.189453"
						width="18"
						height="18"
						fill="url(#pattern012481251)"
					/>
					<defs>
						<pattern
							id="pattern012481251"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image0_685_4623"
								transform="matrix(0.00991837 0 0 0.01 0.00408164 0)"
							/>
						</pattern>
						<image
							id="image0_685_4623"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,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"
						/>
					</defs>
				</svg>
			</>
		)
	}
	const podcasts = () => {
		return users()
	}
	const podcastRequests = () => {
		return (
			<>
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect
						x="0.189453"
						width="18"
						height="18"
						fill="url(#pat085123)"
					/>
					<defs>
						<pattern
							id="pat085123"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image0_685_4635"
								transform="matrix(0.0113636 0 0 0.01 -0.0681818 0)"
							/>
						</pattern>
						<image
							id="image0_685_4635"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE+ElEQVR4nO2cS4gdRRSGv4kZxkwSMRGTiSYgWZgYFxMVRRR8RUQFFxoQcaHgQvAxESG4UEY04isiiG58RFFXPlAXUaKjCzEaHzGZzYjGqImo+I4YoplokpaDZ5hLW9Xem9vdc2/3/0HB5XZ3nepzuruqTp1TIIQQQgghhBBCCCGEEEIIIYQQQgghCmEOcBnwILABGAN2eBnz/+zYpX6uKIhzgZeBfUDSZBkHXgLOkVXy4yTg3RaMECvvAMtlmEPnMOBOYH8OxpgofwN3eN2iBWYBrzep5F+97xjz381cY/3MTFmkeWO8n6HMXcATwCVAf+D6fj+2Dvgto55NLktkMB14I6LAP4H7Wxw52blrgb0Zb4o+XxncHVHc58DSNh7lE4DtkbrXtFFvpTkNOBAZHc3Nof65Xle6fhs0nJJD/ZWiB/gooKxtOU/u5nidaTnWZ4kGLg4oaQ+wpAAtLfW60/IulEUm2VDyt/2ugLzXZJB/WRCY/P0EzC5QQUe4jPSkcZ6MAlcFntaHSlDMwwG5V8og8HhAMeeVoJgVAbmPyiD/dRyO+wSxaHoDnmMbFteeb1JK2VGiRnamZH9de2sAv6eU8l6JStmUkm2+r9qzO6WUjSVqZGNKtj0ctee7lFK+KFEjX6Zk2+ez9nyQUsofwLQStDIt4AW2T1jteTow/Dy9BK2cEZD7VO2tAVwbUMy9JShmbUDuNTIIHAccDAw/+wpUTp/LaJRpbVgkg4RHOwlwc4HKWR2Q97aMMckVAQX94o7HvDkmEgxxuQwyia1rfxZQko3ADs9RUVbXhwE5n5Q0susqLggoysqLOfUnfV5XSIY5GkWAdRGF2fxgoA2NLcgILXpMlogzA9gSUdyPwA3upW0WO/fGwGLURNnsMkUG8z3sJ4kUC+cZBgYz6hj0c2KhP4kHO2iFsAWjbM1Q5kT5GRgFXvUy6v/933UfuwzRAv3uykhyLk9GQlBFCyFC23MwhH0GL5LW86EXuNo74VYNsdkDKcpYFq4lS4CbfE4xllrg2u3/2bFVwPFT3VghhBBCCCFaZ6G76Yd83f1Z4IUG14n9fsaPDfm5do3IiUXA9T6v+KGNWfr3bqzrtG5+aLmAq9wBmBRQDvrsfSin3MXKcizwSEYKcxFlr+eJmGzh2JrEfZ6HnkxR2ecrh7Xub8zZd1sLb8QuYAS4B1jpqcyLG7J0e/z3Yj+20s8d8WubfWNuraMj8sRIGnSSKjt99wbbEahdTvZoxXROSKhYZMoyaoA9xbd4llRMGQeA5zz2tqegNpwJPB/ZqKDxbVldUBs6glm+mVjW6Gd9Tm9DsyzzuUzWFlDrPWu3Usz39e7YTW+d4s3FBjOiXRI/djQVYWEkKtHKX76hWCuhPUVhbbjd2xRq66dVGB7Pi+wtMtFhW0fbaSwHvsowSte+KbMzPlOjBQVS58VAhqdgSzdufNaTEUf7Vpd0kjO9Qw/dwyvdFpw9HLmRkQ7pL5plunuRQ/diE8iu4NRIx2jRIEfSffR7WkQS2KymjFzItpgRCWr7tsvd3gO+w0T6vrblnL+SO2sCjd7fDU9Sk3OV0K7aNmzv2CFuyCXyANVhOHB/4506FD4/Ek9bpfyL3khUvt17x3FUaiMZc9ydRfUYTC0Z7OnkPBPb6vVNTx+zzNqqssLv07ZDP3uqGyOEEEIIIYQQQgghhBBCCLL4BwRVJ2JphdhdAAAAAElFTkSuQmCC"
						/>
					</defs>
				</svg>
			</>
		)
	}
	const profile = () => {
		return (
			<>
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect
						x="0.189453"
						width="18"
						height="18"
						fill="url(#pat085123)"
					/>
					<defs>
						<pattern
							id="pat085123"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image0_685_4635"
								transform="matrix(0.0113636 0 0 0.01 -0.0681818 0)"
							/>
						</pattern>
						<image
							id="image0_685_4635"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE+ElEQVR4nO2cS4gdRRSGv4kZxkwSMRGTiSYgWZgYFxMVRRR8RUQFFxoQcaHgQvAxESG4UEY04isiiG58RFFXPlAXUaKjCzEaHzGZzYjGqImo+I4YoplokpaDZ5hLW9Xem9vdc2/3/0HB5XZ3nepzuruqTp1TIIQQQgghhBBCCCGEEEIIIYQQQgghCmEOcBnwILABGAN2eBnz/+zYpX6uKIhzgZeBfUDSZBkHXgLOkVXy4yTg3RaMECvvAMtlmEPnMOBOYH8OxpgofwN3eN2iBWYBrzep5F+97xjz381cY/3MTFmkeWO8n6HMXcATwCVAf+D6fj+2Dvgto55NLktkMB14I6LAP4H7Wxw52blrgb0Zb4o+XxncHVHc58DSNh7lE4DtkbrXtFFvpTkNOBAZHc3Nof65Xle6fhs0nJJD/ZWiB/gooKxtOU/u5nidaTnWZ4kGLg4oaQ+wpAAtLfW60/IulEUm2VDyt/2ugLzXZJB/WRCY/P0EzC5QQUe4jPSkcZ6MAlcFntaHSlDMwwG5V8og8HhAMeeVoJgVAbmPyiD/dRyO+wSxaHoDnmMbFteeb1JK2VGiRnamZH9de2sAv6eU8l6JStmUkm2+r9qzO6WUjSVqZGNKtj0ctee7lFK+KFEjX6Zk2+ez9nyQUsofwLQStDIt4AW2T1jteTow/Dy9BK2cEZD7VO2tAVwbUMy9JShmbUDuNTIIHAccDAw/+wpUTp/LaJRpbVgkg4RHOwlwc4HKWR2Q97aMMckVAQX94o7HvDkmEgxxuQwyia1rfxZQko3ADs9RUVbXhwE5n5Q0susqLggoysqLOfUnfV5XSIY5GkWAdRGF2fxgoA2NLcgILXpMlogzA9gSUdyPwA3upW0WO/fGwGLURNnsMkUG8z3sJ4kUC+cZBgYz6hj0c2KhP4kHO2iFsAWjbM1Q5kT5GRgFXvUy6v/933UfuwzRAv3uykhyLk9GQlBFCyFC23MwhH0GL5LW86EXuNo74VYNsdkDKcpYFq4lS4CbfE4xllrg2u3/2bFVwPFT3VghhBBCCCFaZ6G76Yd83f1Z4IUG14n9fsaPDfm5do3IiUXA9T6v+KGNWfr3bqzrtG5+aLmAq9wBmBRQDvrsfSin3MXKcizwSEYKcxFlr+eJmGzh2JrEfZ6HnkxR2ecrh7Xub8zZd1sLb8QuYAS4B1jpqcyLG7J0e/z3Yj+20s8d8WubfWNuraMj8sRIGnSSKjt99wbbEahdTvZoxXROSKhYZMoyaoA9xbd4llRMGQeA5zz2tqegNpwJPB/ZqKDxbVldUBs6glm+mVjW6Gd9Tm9DsyzzuUzWFlDrPWu3Usz39e7YTW+d4s3FBjOiXRI/djQVYWEkKtHKX76hWCuhPUVhbbjd2xRq66dVGB7Pi+wtMtFhW0fbaSwHvsowSte+KbMzPlOjBQVS58VAhqdgSzdufNaTEUf7Vpd0kjO9Qw/dwyvdFpw9HLmRkQ7pL5plunuRQ/diE8iu4NRIx2jRIEfSffR7WkQS2KymjFzItpgRCWr7tsvd3gO+w0T6vrblnL+SO2sCjd7fDU9Sk3OV0K7aNmzv2CFuyCXyANVhOHB/4506FD4/Ek9bpfyL3khUvt17x3FUaiMZc9ydRfUYTC0Z7OnkPBPb6vVNTx+zzNqqssLv07ZDP3uqGyOEEEIIIYQQQgghhBBCCLL4BwRVJ2JphdhdAAAAAElFTkSuQmCC"
						/>
					</defs>
				</svg>
			</>
		)
	}
	const host = () => {
		return (
			<>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
					<path d="M32,33A17.019,17.019,0,0,0,15,50V60a1,1,0,0,0,1,1H48a1,1,0,0,0,1-1V50A17.019,17.019,0,0,0,32,33Z" />
					<circle cx="32" cy="22" r="10" />
					<path d="M52.511 3.3A1 1 0 0 0 51.089 4.7a27.491 27.491 0 0 1 0 38.594A1 1 0 1 0 52.511 44.7a29.49 29.49 0 0 0 0-41.406zM5 24A27.286 27.286 0 0 1 12.911 4.7 1 1 0 1 0 11.489 3.3a29.49 29.49 0 0 0 0 41.406A1 1 0 1 0 12.911 43.3 27.286 27.286 0 0 1 5 24z" />
					<path d="M54 24a22.2 22.2 0 0 1-6.451 15.721 1 1 0 0 0 1.422 1.407 24.383 24.383 0 0 0 0-34.256 1 1 0 0 0-1.422 1.407A22.2 22.2 0 0 1 54 24zM15.029 41.128a1 1 0 0 0 1.422-1.407 22.381 22.381 0 0 1 0-31.442 1 1 0 0 0-1.422-1.407 24.383 24.383 0 0 0 0 34.256z" />
					<path d="M44.028 37.57a1 1 0 0 0 1.414-.009 19.323 19.323 0 0 0 0-27.122 1 1 0 0 0-1.423 1.4 17.324 17.324 0 0 1 0 24.312A1 1 0 0 0 44.028 37.57zM18.558 37.561a1 1 0 1 0 1.423-1.405 17.324 17.324 0 0 1 0-24.312 1 1 0 0 0-1.423-1.4 19.323 19.323 0 0 0 0 27.122z" />
				</svg>
			</>
		)
	}
	const access = () => {
		return (
			<>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					x="0"
					y="0"
					version="1.1"
					viewBox="0 0 29 29"
					// xml:space="preserve"
				>
					<path d="M22.023 27h-2.026a1 1 0 110-2H22c.553 0 1.012.447 1.012 1s-.436 1-.989 1zm-6.078 0h-2.026a1 1 0 110-2h2.026a1 1 0 110 2zm-6.079 0H7.841a1 1 0 110-2h2.025a1 1 0 110 2zm-5.742-1.221a.997.997 0 01-.719-.305 4.979 4.979 0 01-1.235-2.181 1 1 0 011.932-.516c.131.487.387.939.741 1.306a1 1 0 01-.719 1.696zm21.281-.68a1 1 0 01-.849-1.525 2.99 2.99 0 00.441-1.435.996.996 0 011.044-.954 1 1 0 01.954 1.044 4.997 4.997 0 01-.738 2.396 1 1 0 01-.852.474zM3 19.996a1 1 0 01-1-1V16.97a1 1 0 112 0v2.026a1 1 0 01-1 1zm23-.864a1 1 0 01-1-1v-2.026a1 1 0 112 0v2.026a1 1 0 01-1 1zM3 13.917a1 1 0 01-1-1v-2.025a1 1 0 112 0v2.025a1 1 0 01-1 1zm23-.863a1 1 0 01-1-1v-2.026a1 1 0 112 0v2.026a1 1 0 01-1 1zM3.004 7.84l-.04-.001a1 1 0 01-.96-1.038 4.976 4.976 0 01.725-2.4.997.997 0 011.374-.333.998.998 0 01.333 1.373c-.264.433-.414.93-.434 1.438a1 1 0 01-.998.961zm22.865-.854a1 1 0 01-.967-.748 3.017 3.017 0 00-.732-1.311.999.999 0 111.445-1.381 4.99 4.99 0 011.223 2.188 1 1 0 01-.969 1.252zM21.183 4h-2.026a1 1 0 110-2h2.026a1 1 0 110 2zm-6.079 0h-2.026a1 1 0 110-2h2.026a1 1 0 110 2zM9.026 4H7c-.553 0-1.023-.447-1.023-.999 0-.553.424-1 .977-1v1l.009-1L9.026 2a1 1 0 110 2zM17 15h-5a1 1 0 01-1-1v-3.5C11 8.57 12.57 7 14.5 7S18 8.57 18 10.5V14a1 1 0 01-1 1zm-4-2h3v-2.5c0-.827-.673-1.5-1.5-1.5s-1.5.673-1.5 1.5V13z" />
					<path d="M19 23h-9c-1.103 0-2-.897-2-2v-6c0-1.103.897-2 2-2h9c1.103 0 2 .897 2 2v6c0 1.103-.897 2-2 2zm-9-8v6h9.002L19 15h-9z" />
					<path d="M14.5 20a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1z" />
				</svg>
			</>
		)
	}
	const myPodcast = () => {
		return (
			<>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					enableBackground="new 0 0 24 24"
					viewBox="0 0 24 24"
				>
					<path d="M1.24,13.059c0.227,1.055,0.592,2.063,1.11,3.01c1.141,2.092,2.98,3.778,5.155,4.754c0.395,0.181,0.807,0.332,1.217,0.468c-0.106-0.436-0.198-0.887-0.274-1.325c-0.014-0.136-0.046-0.271-0.061-0.392c-0.244-0.104-0.471-0.21-0.699-0.314c-1.885-0.95-3.406-2.513-4.303-4.394c-0.381-0.813-0.64-1.671-0.776-2.543c-0.151-0.994-0.151-2.001,0.016-2.98c0.168-0.947,0.47-1.865,0.911-2.723c0.518-1.008,1.232-1.926,2.068-2.678c0.882-0.797,1.901-1.415,3.011-1.834c1.156-0.437,2.387-0.633,3.62-0.603c1.23,0.03,2.448,0.286,3.557,0.782c1.079,0.467,2.069,1.145,2.906,1.972c0.822,0.798,1.475,1.745,1.944,2.784c0.413,0.883,0.672,1.824,0.778,2.787c0.12,1.029,0.062,2.08-0.168,3.088c-0.198,0.902-0.531,1.769-0.983,2.572c-0.991,1.75-2.547,3.165-4.394,3.993c-0.117,0.052-0.234,0.1-0.35,0.15l-0.054,0.36c-0.071,0.455-0.162,0.904-0.278,1.351l0.021-0.023c0.577-0.18,1.14-0.405,1.673-0.661c2.144-1.054,3.908-2.8,4.972-4.922c0.472-0.962,0.822-2,0.989-3.053c0.198-1.129,0.198-2.302,0.016-3.446c-0.168-1.099-0.518-2.182-1.019-3.175c-0.592-1.177-1.396-2.244-2.371-3.139c-1.007-0.928-2.187-1.668-3.467-2.166c-1.329-0.518-2.756-0.773-4.183-0.758c-1.423,0.017-2.838,0.31-4.155,0.857c-1.263,0.527-2.42,1.295-3.345,2.211C3.384,3.987,2.593,5.085,2.031,6.273C1.559,7.282,1.24,8.381,1.088,9.493C0.934,10.682,0.98,11.901,1.24,13.059z" />
					<path d="M11.929,7.474v0.021c-1.483,0-2.683,1.19-2.683,2.649s1.201,2.648,2.683,2.648c1.48,0,2.682-1.189,2.682-2.662C14.612,8.662,13.41,7.474,11.929,7.474z" />
					<path d="M17.159,8.594c0.226,0.512,0.381,1.053,0.456,1.61c0.09,0.632,0.061,1.263-0.062,1.865c-0.107,0.543-0.304,1.07-0.563,1.551c-0.35,0.647-0.821,1.219-1.384,1.67c0.03,0.12,0.061,0.225,0.076,0.346c0.047,0.311,0.047,0.627,0.047,0.943l-0.01,0.47l-0.115,0.106c1.247-0.738,2.266-1.866,2.858-3.176c0.306-0.647,0.503-1.339,0.594-2.046c0.106-0.723,0.077-1.459-0.046-2.182c-0.122-0.692-0.366-1.369-0.685-2.001c-0.394-0.769-0.943-1.46-1.581-2.047c-0.653-0.587-1.399-1.053-2.22-1.368c-0.895-0.347-1.869-0.513-2.843-0.497c-0.959,0.03-1.916,0.241-2.799,0.632c-0.79,0.346-1.52,0.842-2.143,1.459C6.131,6.546,5.615,7.269,5.265,8.05c-0.289,0.633-0.487,1.325-0.578,2.032c-0.106,0.783-0.077,1.579,0.091,2.347c0.138,0.693,0.38,1.355,0.731,1.972c0.592,1.083,1.475,2.017,2.54,2.663v-0.422c0-0.33-0.015-0.631,0.045-0.947l0.092-0.406c-0.64-0.557-1.156-1.234-1.506-2.002c-0.227-0.51-0.38-1.052-0.456-1.609c-0.075-0.571-0.061-1.158,0.045-1.73c0.107-0.556,0.288-1.084,0.548-1.58c0.304-0.616,0.73-1.158,1.248-1.624c0.517-0.466,1.11-0.827,1.749-1.083c0.714-0.271,1.491-0.407,2.251-0.392c0.76,0.016,1.521,0.196,2.22,0.496c0.639,0.287,1.202,0.678,1.704,1.159C16.475,7.406,16.871,7.978,17.159,8.594z" />
					<path d="M11.929,13.573c-1.469,0-2.662,1.182-2.662,2.633C9.267,24,11.929,24,11.929,24s2.661,0,2.661-7.794C14.59,14.755,13.398,13.573,11.929,13.573z" />
				</svg>
			</>
		)
	}

	const manageSubscription = () => {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
				<path
					fillRule="evenodd"
					d="M126.38 137.485c65.38 0 118.38 53.001 118.38 118.38s-53.001 118.38-118.38 118.38c-65.379 0-118.38-53-118.38-118.38s53.001-118.38 118.38-118.38zm8 252.516v73.374h187.87v16H126.38a8 8 0 0 1-8-8v-81.373c2.648.156 5.313.243 8 .243s5.353-.088 8-.244zm187.871-18.313v-16h-90.626l-7.557-7.557a135.47 135.47 0 0 1-11.662 10.963l10.209 10.209a7.977 7.977 0 0 0 5.698 2.385h93.938zm0-107.688h-61.743c.161-2.692.252-5.402.252-8.135 0-2.641-.085-5.262-.235-7.865h61.725v16h.001zm0-107.687v-16h-93.938a8.002 8.002 0 0 0-7.462 5.113l-5.065 10.13a135.415 135.415 0 0 1 11.836 11.953l5.598-11.197h89.031v.001zm-203.87-34.584V40.625a8 8 0 0 1 8-8h195.87v16H134.38v73.104c-2.648-.156-5.313-.244-8-.244s-5.352.088-7.999.244zm228.635 209.334h148.219c4.821 0 8.765 3.944 8.765 8.765v47.719c0 4.821-3.944 8.765-8.765 8.765H347.016c-4.821 0-8.765-3.944-8.765-8.765v-47.719c-.001-4.821 3.944-8.765 8.765-8.765zm0 107.687h148.219c4.821 0 8.765 3.944 8.765 8.765v47.72c0 4.821-3.944 8.765-8.765 8.765H347.016c-4.821 0-8.765-3.944-8.765-8.765v-47.72c-.001-4.821 3.944-8.765 8.765-8.765zm0-323.062h148.219c4.821 0 8.765 3.944 8.765 8.765v47.72c0 4.821-3.944 8.765-8.765 8.765H347.016c-4.821 0-8.765-3.944-8.765-8.765v-47.72c-.001-4.821 3.944-8.765 8.765-8.765zm0-107.688h148.219c4.821 0 8.765 3.944 8.765 8.765v47.72c0 4.821-3.944 8.765-8.765 8.765H347.016c-4.821 0-8.765-3.944-8.765-8.765v-47.72C338.25 11.944 342.195 8 347.016 8zm0 215.376h148.219c4.821 0 8.765 3.944 8.765 8.765v47.72c0 4.821-3.944 8.765-8.765 8.765H347.016c-4.821 0-8.765-3.944-8.765-8.765v-47.72c-.001-4.821 3.944-8.765 8.765-8.765zm31.359 148.312h85.5a8 8 0 0 0 0-16h-85.5a8 8 0 0 0 0 16zm0-107.688h85.5a8 8 0 0 0 0-16h-85.5a8 8 0 0 0 0 16zm0-215.375h85.5a8 8 0 0 0 0-16h-85.5a8 8 0 0 0 0 16zm0 107.688h85.5a8 8 0 0 0 0-16h-85.5a8 8 0 0 0 0 16zm0 323.062h85.5a8 8 0 0 0 0-16h-85.5a8 8 0 0 0 0 16zM126.381 157.47c-27.17 0-51.769 11.014-69.576 28.82-17.806 17.806-28.82 42.406-28.82 69.576 0 27.17 11.014 51.769 28.82 69.576 17.806 17.806 42.406 28.82 69.576 28.82s51.769-11.014 69.575-28.82c17.806-17.806 28.82-42.405 28.82-69.576 0-27.17-11.013-51.769-28.82-69.576-17.806-17.806-42.405-28.82-69.575-28.82zm58.262 40.132c-14.91-14.91-35.509-24.132-58.263-24.132s-43.353 9.223-58.263 24.132c-14.91 14.91-24.132 35.51-24.132 58.263s9.222 43.353 24.132 58.263c14.91 14.91 35.51 24.132 58.263 24.132s43.352-9.222 58.263-24.132c14.91-14.91 24.133-35.51 24.133-58.263s-9.223-43.352-24.133-58.263zm-23.796 27.508c-4.891-11.648-14.203-18.378-24.439-20.973a37 37 0 0 0-1.508-.349v-5.125a8.519 8.519 0 1 0-17.038 0v5.25c-5.619 1.244-10.883 3.677-15.162 7.156-6.904 5.614-11.282 13.766-10.789 23.933.496 10.238 5.6 17.101 12.705 21.739 6.117 3.993 13.595 6.053 20.483 7.184 5.352.879 11.055 2.262 15.355 4.857 3.306 1.996 5.789 4.902 6.315 9.242.074.611.113 1.036.119 1.278.08 3.377-1.548 5.961-3.994 7.817-3.2 2.428-7.731 3.864-12.28 4.415-1.267.154-2.353.241-3.252.262-5.373.129-10.667-1.181-14.791-3.928-3.331-2.219-5.876-5.461-6.937-9.717a8.498 8.498 0 0 0-16.505 4.059c2.18 8.744 7.333 15.354 14.058 19.833 4.364 2.906 9.396 4.872 14.675 5.897v5.126a8.519 8.519 0 1 0 17.038 0v-4.961c6.485-1.096 13.039-3.529 18.243-7.478 6.572-4.987 10.945-12.133 10.716-21.726a30.192 30.192 0 0 0-.186-2.875c-1.272-10.476-6.932-17.29-14.435-21.82-6.511-3.931-14.288-5.884-21.411-7.053-4.963-.815-10.178-2.186-13.961-4.655-2.794-1.824-4.799-4.457-4.985-8.295-.204-4.206 1.635-7.601 4.533-9.957 2.324-1.89 5.298-3.204 8.528-3.855a23.474 23.474 0 0 1 10.338.251c5.38 1.364 10.279 4.911 12.859 11.057a8.517 8.517 0 0 0 15.708-6.589z"
					clipRule="evenodd"
				/>
			</svg>
		)
	}

	const settings = () => {
		return (
			<>
				<svg
					width="22"
					height="22"
					viewBox="0 0 22 22"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<rect width="22" height="22" fill="url(#pattern123)" />
					<defs>
						<pattern
							id="pattern123"
							patternContentUnits="objectBoundingBox"
							width="1"
							height="1"
						>
							<use
								xlinkHref="#image232_482_123"
								transform="scale(0.01)"
							/>
						</pattern>
						<image
							id="image232_482_123"
							width="100"
							height="100"
							xlinkHref="data:image/png;base64,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"
						/>
					</defs>
				</svg>
			</>
		)
	}

	switch (logo) {
		case "dashboard":
			return dashboard()
		case "documentation":
			return documentation()
		case "pricing":
			return pricing()
		case "landing":
			return landing()
		case "requests":
			return requests()
		case "users":
			return users()
		case "podcasts":
			return podcasts()
		case "messages":
			return messages()
		case "confirmPodcasts":
			return confirmPodcasts()
		case "podcastRequests":
			return podcastRequests()
		case "profile":
			return profile()
		case "host":
			return host()
		case "access":
			return access()
		case "mypodcast":
			return myPodcast()
		case "subscription":
			return manageSubscription()
		case "settings":
			return settings()
		case "mediaz":
			return mediaz()
		default:
			return dashboard()
	}
}
export const CommonSidebar = function (role, access, profileId, menuRefs) {
	const router = useRouter()
	const { user } = useCurrentUser()
	const { podcasts: hostedPodcasts } = useHostPodcasts()
	const { episodes: guestEpisodes } = usePublicGuestEpisodes(user?._id)
	const { request } = useRequest("owner")
	const { newMessages } = useConversationsNewMessages()

	const confirmedPodcasts = hostedPodcasts?.filter(
		podcast => podcast.hosts.confirmed
	)

	const unconfirmedPodcasts = hostedPodcasts?.filter(
		podcast => !podcast.hosts.confirmed
	)

	const sideOptions = [
		{
			name: "Dashboard",
			path: "/dashboard",
			access: ["admin"],
			logo: Logos("dashboard")
		},
		{
			name: "Pricing",
			path: "/pricing-plans/edit",
			access: ["admin", "editor"],
			logo: Logos("pricing")
		},
		{
			name: "Page Content",
			path: "/landing",
			access: ["admin", "editor"],
			logo: Logos("landing")
		},
		{
			name: "User Requests",
			path: "/users/requests",
			access: ["admin"],
			logo: Logos("requests")
		},
		{
			name: "Users",
			path: "/users",
			access: ["admin"],
			logo: Logos("users")
		},
		{
			name: "My FAVZ",
			path: "/mypodcasts",
			access: ["user", "owner", "host", "guest"],
			logo: Logos("mypodcast")
		},
		{
			name: "Messages",
			path: "/messages",
			access: ["user", "host", "guest", "owner", "admin"],
			logo: Logos("messages"),
			number: newMessages && newMessages > 0 ? newMessages : null
		},
		{
			name: "Host Requests",
			path: "/podcasts/requests",
			access: ["user", "host"],
			logo: Logos("podcastRequests"),
			condition: () => {
				return (
					confirmedPodcasts?.length > 0 ||
					unconfirmedPodcasts?.length > 0
				)
			}
			// number: Number(unconfirmedPodcasts?.length)
		},
		{
			name: "Guest PODZ",
			path: `/guest-podz`,
			access: ["guest"],
			logo: Logos("users"),
			condition: () => {
				return guestEpisodes?.length > 0
			}
		},
		{
			name: "My PODZ",
			path: "/podcasts",
			access: ["user", "owner"],
			logo: Logos("podcasts"),
			condition: () => {
				return request
			}
		},
		// {
		// 	name: "Approved Podcasts",
		// 	access: ["host"],
		// 	path: "/podcasts/list",
		// 	logo: Logos("confirmPodcasts"),
		// 	number: Number(confirmedPodcasts?.length)
		// },

		{
			name: "My Profile",
			path: `/profile`,
			access: ["user", "host", "guest", "owner"],
			logo: Logos("profile")
		},

		// {
		// 	name: "Request Access",
		// 	path: "/requests/access",
		// 	access: ["user"],
		// 	logo: Logos("access")
		// },
		// {
		// 	name: "Manage Subscription",
		// 	path: "/pricing-plans",
		// 	access: ["user", "owner"],
		// 	logo: Logos("subscription")
		// },
		{
			name: "MediaZ",
			path: "/mediaz",
			access: ["owner", "admin"],
			logo: Logos("mediaz")
		},
		{
			name: "Documentation",
			path: "/documentation",
			access: ["admin"],
			logo: Logos("documentation")
		},
		{
			name: "Settings",
			path: "/settings",
			access: ["user", "host", "guest", "owner"],
			logo: Logos("settings")
		},
		{
			name: "PODZ Management",
			path: "/podz-management",
			access: ["admin"],
			logo: Logos("settings")
		}
	]

	let sidebarArr = []
	const currentRoute = {
		active: "cursor-pointer flex items-center p-6 text-base font-normal text-gray-900 dark:text-white md:bg-primary-100 dark:hover:bg-gray-700",
		inactive:
			"cursor-pointer flex items-center p-6 text-base font-normal text-gray-900 dark:text-white hover:bg-primary-50 dark:hover:bg-gray-700"
	}
	return (
		<>
			{sideOptions.map((data, index) =>
				access.map((item, accessIndex) => {
					if (
						data.access?.includes(item) &&
						!sidebarArr.includes(data.name) &&
						(!data.condition || data.condition())
					) {
						sidebarArr.push(data.name)
						return (
							<li
								onClick={() => {
									menuRefs.forEach(ref => {
										ref.current.classList.toggle("hidden")
									})
								}}
								className="border-b border-primary-100 md:border-b-0"
								key={accessIndex}
							>
								<Link
									passHref
									legacyBehavior={false}
									href={`${
										// data.name === "My PODZ"
										// 	? user?.access?.includes("owner")
										// 		? "/podcasts"
										// 		: "/podcast-requests"
										// 	: data.path
										data.name === "My PODZ"
											? user?.access.includes("owner")
												? "/podcasts"
												: "/podcast-requests"
											: data.path
									}`}
								>
									<div
										className={
											router.pathname === data.path
												? currentRoute.active
												: currentRoute.inactive
										}
									>
										<svg
											aria-hidden="true"
											className="flex-shrink-0 w-6 h-6 text-black transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											{data.logo}
										</svg>
										<span className="ml-3">
											{data.name}
										</span>
										{data.number && (
											<div className="text-xs w-[22px] h-[22px] ml-auto text-white rounded-full bg-primary flex items-center justify-center">
												{data.number
													? data.number
													: null}
											</div>
										)}
									</div>
								</Link>
							</li>
						)
					}
				})
			)}
		</>
	)
}
