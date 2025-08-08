import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertQuoteSchema, type Quote } from "@shared/schema";
import { MessageSquare, Plus, Loader2, CheckCircle } from "lucide-react";
import kitchinPhoto from "@assets/1652354042774_1754675394828.jpg";

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const { toast } = useToast();

  // Form setup
  const form = useForm({
    resolver: zodResolver(insertQuoteSchema),
    defaultValues: {
      text: "",
    },
  });

  // Get random quote mutation
  const getRandomQuoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/quotes/random");
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      return response.json();
    },
    onSuccess: (quote: Quote) => {
      setCurrentQuote(quote);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch a quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add quote mutation
  const addQuoteMutation = useMutation({
    mutationFn: async (data: { text: string }) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your wisdom has been added to the Kitchin collection.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get recent quotes
  const { data: recentQuotes = [] } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
  });

  const handleGetQuote = () => {
    getRandomQuoteMutation.mutate();
  };

  const onSubmit = (data: { text: string }) => {
    addQuoteMutation.mutate(data);
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Quotes from the Kitchin
            </h1>
            <p className="text-lg text-slate-600">
              Wisdom served fresh from the kitchen of knowledge
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Quote Button */}
        <div className="text-center mb-16">
          <Button
            onClick={handleGetQuote}
            disabled={getRandomQuoteMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 h-auto"
          >
            {getRandomQuoteMutation.isPending ? (
              <span className="inline-flex items-center">
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Fetching wisdom from the Kitchin...
              </span>
            ) : (
              <span className="inline-flex items-center">
                <MessageSquare className="w-6 h-6 mr-3" />
                Get a Quote from the Kitchin
              </span>
            )}
          </Button>
        </div>

        {/* Quote Display */}
        {currentQuote && (
          <div className="mb-16 animate-fade-in">
            <Card className="shadow-lg border border-slate-200">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  {/* Kitchin Photo Integration */}
                  <div className="flex-shrink-0">
                    <img
                      src={kitchinPhoto}
                      alt="The Kitchin - wise kitchen advisor"
                      className="w-16 h-16 rounded-full shadow-lg border-4 border-amber-400 animate-bounce"
                    />
                  </div>

                  {/* Quote Content */}
                  <div className="flex-1">
                    <blockquote className="text-xl text-slate-700 italic leading-relaxed mb-4">
                      "{currentQuote.text}"
                    </blockquote>
                    <footer className="text-sm text-slate-500 flex items-center">
                      <span className="font-medium text-amber-600">The Kitchin</span>
                      <span className="mx-2">•</span>
                      <span>{formatTimeAgo(currentQuote.createdAt)}</span>
                    </footer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Quote Form */}
        <Card className="shadow-lg border border-slate-200 mb-16">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Add Your Own Kitchin Wisdom
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Your Quote
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="resize-none"
                          placeholder="Share your kitchen wisdom..."
                          maxLength={280}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          Share wisdom from the kitchen of life
                        </span>
                        <span className="text-xs text-slate-400">
                          {field.value.length}/280
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => form.reset()}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Clear
                  </Button>

                  <Button
                    type="submit"
                    disabled={addQuoteMutation.isPending}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-300"
                  >
                    {addQuoteMutation.isPending ? (
                      <span className="inline-flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding Quote...
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Quote
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recent Quotes */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Recent Wisdom from the Kitchin
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {recentQuotes.slice(0, 4).map((quote) => (
              <Card
                key={quote.id}
                className="border border-slate-200 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <p className="text-slate-700 text-sm italic mb-2">
                    "{quote.text}"
                  </p>
                  <span className="text-xs text-slate-500">
                    {formatTimeAgo(quote.createdAt)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600">
              © 2024 Quotes from the Kitchin. All wisdom served fresh.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Built with ❤️ and a pinch of humor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
