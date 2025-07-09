import { useNavigate } from "react-router-dom";
import { type ContextValue, useDarkMode } from "../context/DarkModeContext";
import { useEffect } from "react";
import { Brain, Zap, Target, FileText } from "lucide-react";
import { PrimaryButton } from "@/components";

const Home = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode() as ContextValue;

  useEffect(() => {
    document.title = `Home | Quizzer AI`;
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered",
      description: "Smart questions from any content you provide.",
      color: "from-blue-500/20 to-blue-600/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Multiple Formats",
      description: "Flashcards, MCQs, true/false, and more.",
      color: "from-green-500/20 to-green-600/20",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Any Source",
      description: "The Internet, PDFs or your own notes.",
      color: "from-purple-500/20 to-purple-600/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  const quizModes = [
    {
      title: "FlashCards",
      description: "Quick flip-through review",
      emoji: "🃏",
      route: "/flashcard",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Multiple Choice",
      description: "Classic quiz format",
      emoji: "🎯",
      route: "/mcq",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Fact OR Not",
      description: "True or false challenges",
      emoji: "⚡",
      route: "/fact-or-not",
      gradient: "from-purple-500 to-purple-600",
    },
    // {
    //   title: "MultiPlayer",
    //   description: "Challenge your friends",
    //   emoji: "👥",
    //   route: "/multiplayer",
    //   gradient: "from-orange-500 to-orange-600",
    // },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-14 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div
                  className={`inline-flex items-center px-4 py-2 ${
                    isDarkMode
                      ? "bg-cta/20 text-darkmodeCTA"
                      : "bg-cta/10 text-cta"
                  } rounded-full text-sm font-medium`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  AI Quiz Generator
                </div>
                <h1
                  className={`text-5xl lg:text-7xl font-bold ${
                    isDarkMode
                      ? "bg-gradient-to-r to-cta via-white from-darkmodeCTA"
                      : "bg-gradient-to-r to-hovercta via-slate-800 from-cta"
                  } bg-clip-text text-transparent leading-tight`}
                >
                  Quizzer AI
                </h1>
                <p
                  className={`text-xl lg:text-2xl ${
                    isDarkMode ? "text-gray-300" : "text-slate-600"
                  } max-w-2xl`}
                >
                  Your friendly AI companion that turns any content into fun,
                  engaging quizzes. Learning made simple! 🎉
                </p>
              </div>

              <div className="flex flex-row flex-wrap gap-4 justify-center lg:justify-start">
                <PrimaryButton
                  onClick={() => navigate("/mcq")}
                  text="Start Quizzing!"
                  className=" text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                ></PrimaryButton>
              </div>

              <div
                className={`flex items-center flex-wrap justify-center lg:justify-start gap-8 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Multiple Quiz Types</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Create your notes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cta/15 to-hovercta/15 rounded-3xl blur-3xl"></div>
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427090/quiz_imfkoz.png"
                  className="w-full max-w-md mx-auto transform hover:scale-105 transition-transform"
                  alt="Quizzer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl lg:text-4xl font-bold ${
                isDarkMode ? "text-white" : "text-slate-900"
              } mb-4`}
            >
              Why Choose Quizzer? 🌟
            </h2>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-slate-600"
              } max-w-2xl mx-auto`}
            >
              Made for learners by learners — built for pure learning joy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-2xl ${
                  isDarkMode ? "bg-gray-800/50" : "bg-white"
                } shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <div className={feature.iconColor}>{feature.icon}</div>
                </div>
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  } mb-2`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-slate-600"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Modes Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl lg:text-4xl font-bold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                } mb-4`}
              >
                Pick Your Challenge Mode 🎮
              </h2>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-slate-600"
                }`}
              >
                Different formats for different moods
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizModes.map((mode, index) => (
                <div
                  key={index}
                  onClick={() => navigate(mode.route)}
                  className="group cursor-pointer"
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${mode.gradient} p-6 h-48 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div className="text-right">
                        <div className="text-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                          {mode.emoji}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
                        <p className="text-white/80 text-sm">
                          {mode.description}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2
              className={`text-3xl lg:text-4xl font-bold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Ready to Make Learning Fun? 🚀
            </h2>
            <p
              className={`text-xl ${
                isDarkMode ? "text-gray-300" : "text-slate-600"
              }`}
            >
              Join thousands of learners who are making studying more engaging
              with AI-powered quizzes.
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <PrimaryButton
                onClick={() => navigate("/mcq")}
                text="Start Quizzing!"
                className=" text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              ></PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
