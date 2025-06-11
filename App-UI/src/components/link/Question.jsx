import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { RadioGroup, Radio } from "@heroui/radio";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";import { ChevronLeft, ChevronRight } from "lucide-react"; // Arrow icons

export const Question = ({ index, question, selectedAnswer, onAnswer, onPrev, onNext, isLast }) => {
    const options = ['א - אף פעם לא', 'פ - לפעמים', 'ת - לעיתים קרובות/תמיד']; // Answer choices in Hebrew

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && selectedAnswer) {
                onNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedAnswer, onNext]); // Depend on selectedAnswer and onNext

    return (
        <Card className="w-[600px] h-[350px] bg-white shadow-lg rounded-2xl border border-gray-200" dir="rtl">
            <CardHeader className="text-xl font-semibold text-right">{index}) {question}</CardHeader>
            
            <CardBody className="flex flex-col justify-between h-full">
                <RadioGroup
                    value={selectedAnswer}
                    onValueChange={(value) => onAnswer(value)}
                    className="gap-4"
                >
                    {options.map((option) => (
                        <Radio key={option} value={option} className="text-lg font-medium">
                            {option}
                        </Radio>
                    ))}
                </RadioGroup>

                <div className="flex justify-between">
                    <Button
                        onPress={onPrev}
                        isDisabled={index === 1}
                        variant="bordered"
                        className="text-lg"
                        startContent={<ChevronRight size={20} />}
                    >
                        הקודם
                    </Button>

                    <Button
                        onPress={onNext}
                        isDisabled={isLast}
                        color="primary"
                        className="text-lg"
                        endContent={<ChevronLeft size={20} />}
                    >
                        הבא
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

Question.propTypes = {
    index: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    selectedAnswer: PropTypes.string,
    onAnswer: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    isLast: PropTypes.bool.isRequired,
};
