import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useTimer = (initialTime: number, quizId: string) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.warn("You didn't have time to complete the quest!");
          navigate(`/quizInfo/${quizId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, quizId]);

  return timeLeft;
};

export default useTimer;