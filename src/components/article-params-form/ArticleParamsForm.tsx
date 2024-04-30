import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';

import styles from './ArticleParamsForm.module.scss';
import arrowStyles from '../arrow-button/ArrowButton.module.scss';
import clsx from 'clsx';

import { FormEvent, useEffect, useRef, useState } from 'react';
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
import { Text } from '../text';
import { useClose } from 'src/hooks/useClose';

export type ArticleParamsFormProps = {
	onApply: (setState: ArticleStateType) => void;
};

export const ArticleParamsForm = (prop: ArticleParamsFormProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [formState, setFormState] = useLocalStorage<ArticleStateType>(
		'formState',
		defaultArticleState
	);
	const asideRef = useRef<HTMLElement>(null);

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const toggleButton = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const setDeafault = () => {
		prop.onApply(defaultArticleState);
		setFormState(defaultArticleState);
		closeMenu();
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

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		prop.onApply(formState);
		closeMenu();
	};

	useClose({
		isOpen: isMenuOpen,
		onClose: closeMenu,
		rootRef: asideRef,
	});

	useEffect(() => {
		if (!isMenuOpen) return;

		const handleOutsideClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const isArrow =
				target.classList.contains(`${arrowStyles.container}`) &&
				target.classList.contains(`${arrowStyles.arrow}`);
			const isInsideAside = asideRef.current?.contains(target);

			if (!isArrow && !isInsideAside) {
				closeMenu();
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<>
			<ArrowButton onClick={toggleButton} isMenuOpen={isMenuOpen} />
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}>
				<form className={styles.form} onSubmit={onSubmit}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
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
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
