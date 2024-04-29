import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';

import styles from './ArticleParamsForm.module.scss';
import arrowStyles from '../arrow-button/ArrowButton.module.scss';
import clsx from 'clsx';

import { useEffect, useRef, useState } from 'react';
import { Select } from '../select';
import {
	ArticleStateType,
	OptionType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';
import { Separator } from '../separator';
import { RadioGroup } from '../radio-group';
import { useLocalStorage } from 'src/hooks/useLocalStorage';

export type ArticleParamsFormProps = {
	onApply: (setState: ArticleStateType) => void;
};

export const ArticleParamsForm = (prop: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [formState, setFormState] = useLocalStorage<ArticleStateType>(
		'formState',
		defaultArticleState
	);

	const asideRef = useRef<HTMLElement>(null);

	const toggleButton = () => {
		setIsOpen(!isOpen);
	};

	const setDeafault = () => {
		prop.onApply(defaultArticleState);
		setFormState(defaultArticleState);
	};

	const setFontFamily = (selected: OptionType) => {
		setFormState({ ...formState, fontFamilyOption: selected });
	};

	const setFontColor = (selected: OptionType) => {
		setFormState({ ...formState, fontColor: selected });
	};

	const setBackgroundColor = (selected: OptionType) => {
		setFormState({ ...formState, backgroundColor: selected });
	};

	const setContentWidth = (selected: OptionType) => {
		setFormState({ ...formState, contentWidth: selected });
	};

	const setfontSize = (selected: OptionType) => {
		setFormState({ ...formState, fontSizeOption: selected });
	};

	const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		prop.onApply(formState);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const isArrow =
				target.classList.contains(`${arrowStyles.container}`) &&
				target.classList.contains(`${arrowStyles.arrow}`);
			const isInsideAside = asideRef.current?.contains(target);

			if (!isArrow && !isInsideAside) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<>
			<ArrowButton onClick={toggleButton} isOpen={isOpen} />
			<aside
				ref={asideRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form className={styles.form}>
					<h2>Задайте параметры</h2>
					<Select
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={setFontFamily}
						title={'шрифт'}></Select>
					<RadioGroup
						name={'fontSize'}
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={setfontSize}
						title='размер шрифта'></RadioGroup>
					<Select
						options={fontColors}
						selected={formState.fontColor}
						onChange={setFontColor}
						title={'цвет шрифта'}></Select>
					<Separator></Separator>
					<Select
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={setBackgroundColor}
						title={'цвет фона'}></Select>
					<Select
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={setContentWidth}
						title={'ширина контента'}></Select>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' onClick={setDeafault} type='reset' />
						<Button title='Применить' onClick={onSubmit} type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
